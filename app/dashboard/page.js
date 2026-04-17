"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/lib/userSlice";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      } else {
        dispatch(
          setUser({
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
          })
        );
      }
    });

    return () => unsubscribe();
  }, [dispatch, router]);

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
          <div className="text-sm text-gray-700 text-right">
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>UID:</b> {user.uid}</p>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}