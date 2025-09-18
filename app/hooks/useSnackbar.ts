import { snackbarService } from "../services/snackbarService";

export function useSnackbar() {
  const showSuccess = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    return snackbarService.success(title, description, duration);
  };

  const showError = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    return snackbarService.error(title, description, duration);
  };

  const remove = (id: string) => {
    snackbarService.remove(id);
  };

  const clear = () => {
    snackbarService.clear();
  };

  return {
    showSuccess,
    showError,
    remove,
    clear,
  };
}
