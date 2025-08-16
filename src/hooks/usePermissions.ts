import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { userData } = useAuth();
  
  const isAdmin = userData?.role === 'admin';
  const isMember = userData?.role === 'member';
  
  const canCreateProject = isAdmin;
  const canEditProject = isAdmin;
  const canDeleteProject = isAdmin;
  const canViewProject = isAdmin || isMember;
  
  const canCreateTask = isAdmin;
  const canEditTask = isAdmin;
  const canDeleteTask = isAdmin;
  const canAssignTask = isAdmin;
  const canViewTask = isAdmin || isMember;
  const canUpdateTaskStatus = isAdmin || isMember;
  
  return {
    isAdmin,
    isMember,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canViewProject,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canAssignTask,
    canViewTask,
    canUpdateTaskStatus,
  };
};