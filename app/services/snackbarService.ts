export interface SnackbarItem {
  id: string;
  type: "success" | "error";
  title: string;
  description?: string;
  duration?: number;
}

class SnackbarService {
  private listeners: Array<(snackbars: SnackbarItem[]) => void> = [];
  private snackbars: SnackbarItem[] = [];

  subscribe(listener: (snackbars: SnackbarItem[]) => void) {
    this.listeners.push(listener);

    // return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.snackbars]));
  }

  show(
    type: "success" | "error",
    title: string,
    description?: string,
    duration = 5000
  ) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const snackbar: SnackbarItem = {
      id,
      type,
      title,
      description,
      duration,
    };

    this.snackbars.push(snackbar);
    this.notify();

    // auto-remove after duration
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  success(title: string, description?: string, duration?: number) {
    return this.show("success", title, description, duration);
  }

  error(title: string, description?: string, duration?: number) {
    return this.show("error", title, description, duration);
  }

  remove(id: string) {
    this.snackbars = this.snackbars.filter((snackbar) => snackbar.id !== id);
    this.notify();
  }

  clear() {
    this.snackbars = [];
    this.notify();
  }
}

export const snackbarService = new SnackbarService();
