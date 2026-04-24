"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

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

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const [tasks, setTasks] = useState([]);

  //  EDIT STATES
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  //  AUTH CHECK
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

  //  FETCH TASKS
  const fetchTasks = async (uid) => {
    const q = query(collection(db, "tasks"), where("userId", "==", uid));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTasks(data);
  };

  //  ADD TASK
  const addTask = async (task) => {
    await addDoc(collection(db, "tasks"), {
      ...task,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    fetchTasks(auth.currentUser.uid);
  };

  //  DELETE TASK
  const deleteTask = async (id) => {
    if (!confirm("Are you sure?")) return;

    await deleteDoc(doc(db, "tasks", id));
    fetchTasks(auth.currentUser.uid);
  };

  //  OPEN EDIT MODAL
  const openEdit = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditStatus(task.status);
    setEditPriority(task.priority || "medium");
  };

  //  UPDATE TASK
  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "tasks", editingTask.id), {
      title: editTitle,
      status: editStatus,
      priority: editPriority,
    });

    setEditingTask(null);
    fetchTasks(auth.currentUser.uid);
  };

  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    router.push("/login");
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {user && (
          <div className="text-sm text-white-700 text-right">
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>UID:</b> {user.uid}</p>
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Logout
      </button>

      {/* ADD TASK */}
      <TaskForm addTask={addTask} />

      {/* TASK LIST */}
      <div className="mt-6">
        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="border p-4 rounded-lg mb-3 flex justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold text-lg">{task.title}</p>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
              </div>

              <div className="flex gap-2">
                {/* EDIT */}
                <button
                  onClick={() => openEdit(task)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="bg-black w-[400px] rounded-2xl shadow-2xl p-6">
            
            <h2 className="text-2xl font-bold mb-4 text-center">
               Edit Task
            </h2>

            <form onSubmit={handleUpdate}>
              {/* TITLE */}
              <label className="block text-sm mb-1">Title</label>
              <input
                className="w-full border p-2 mb-3 rounded"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              {/* STATUS */}
              <label className="block text-sm mb-1">Status</label>
              <select
                className="w-full border p-2 mb-3 rounded"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="done"> Done</option>
                <option value="progress"> Progress</option>
              </select>

              {/* PRIORITY */}
              <label className="block text-sm mb-1">Priority</label>
              <select
                className="w-full border p-2 mb-4 rounded"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="low"> Low</option>
                <option value="medium"> Medium</option>
                <option value="high"> High</option>
              </select>

              {/* BUTTONS */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHART */}
      <TaskChart tasks={tasks} />
    </div>
  );
}