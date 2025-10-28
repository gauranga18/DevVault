import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query,
  where,
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// Create a project
export const createProject = async (userId, projectData) => {
  const project = {
    ...projectData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, "projects"), project);
  return { id: docRef.id, ...project };
};

// Get projects for user
export const getUserProjects = async (userId) => {
  const q = query(
    collection(db, "projects"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Update project
export const updateProject = async (projectId, updates) => {
  await updateDoc(doc(db, "projects", projectId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Delete project
export const deleteProject = async (projectId) => {
  await deleteDoc(doc(db, "projects", projectId));
};
