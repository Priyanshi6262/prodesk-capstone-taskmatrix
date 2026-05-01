"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/lib/userSlice";

import TaskForm from "@/components/TaskForm";
import TaskChart from "@/components/TaskChart";

import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  // FETCH TASKS
  const fetchTasks = async (uid) => {
    try {
      setLoading(true);

      const q = query(collection(db, "tasks"), where("userId", "==", uid));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(data);
    } catch (error) {
      toast.error("❌ Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // ADD TASK
  const addTask = async (task) => {
    try {
      await addDoc(collection(db, "tasks"), {
        ...task,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });

      toast.success("✅ Task added");
      fetchTasks(auth.currentUser.uid);
    } catch {
      toast.error("❌ Failed to add task");
    }
  };

  // DELETE TASK (❌ removed confirm)
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.success("🗑️ Task deleted");
      fetchTasks(auth.currentUser.uid);
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  // EDIT OPEN
  const openEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditPriority(task.priority || "medium");
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "tasks", editingTask.id), {
        title: editTitle,
        status: editStatus,
        priority: editPriority,
      });

      toast.success("✅ Task updated");
      setEditingTask(null);
      fetchTasks(auth.currentUser.uid);
    } catch {
      toast.error("❌ Update failed");
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    router.push("/login");
  };

  // AUTH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      } else {
        dispatch(
          setUser({
            name: firebaseUser.displayName || "No Name",
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          })
        );

        fetchTasks(firebaseUser.uid);
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  return (
    <>
      <Navbar />

      <div className="p-4 md:p-6 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {user && (
            <div className="text-sm text-gray-700">
              <p><b>Name:</b> {user.name}</p>
              <p className="break-words"><b>Email:</b> {user.email}</p>
              <p className="break-words"><b>UID:</b> {user.uid}</p>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-6 w-full md:w-auto"
        >
          Logout
        </button>

        {/* ADD TASK */}
        <TaskForm addTask={addTask} />

        {/* TASK LIST */}
        <div className="mt-6">

          {/* 🔥 SKELETON LOADER */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-4 border rounded">
                  <div className="h-4 bg-gray-300 mb-2 w-1/2"></div>
                  <div className="h-3 bg-gray-200 w-1/3"></div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="border p-4 rounded-lg mb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm"
              >
                <div className="w-full">
                  <p className="font-semibold text-lg break-words">
                    {task.title}
                  </p>
                  <p className="text-sm">Status: {task.status}</p>
                  <p className="text-sm">Priority: {task.priority}</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => openEdit(task)}
                    className="flex-1 md:flex-none bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* EDIT MODAL */}
       {editingTask && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    
    <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200">

      <h2 className="text-2xl font-semibold mb-5 text-center text-gray-800">
        Edit Task
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        {/* Title Input */}
        <input
          className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task Title"
        />

        {/* Status Select */}
        <select
          className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
        >
          <option className="text-gray-800 bg-white" value="todo">Todo</option>
          <option className="text-gray-800 bg-white" value="progress">Progress</option>
          <option className="text-gray-800 bg-white" value="done">Done</option>
        </select>

        {/* Priority Select */}
        <select
          className="w-full border border-gray-300 p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
        >
          <option className="text-gray-800 bg-white" value="low">Low</option>
          <option className="text-gray-800 bg-white" value="medium">Medium</option>
          <option className="text-gray-800 bg-white" value="high">High</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="w-full py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  </div>
)}

        {/* CHART */}
        <TaskChart tasks={tasks} />
      </div>
    </>
  );
}