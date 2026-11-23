"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/admin-actions";

const Pending = createContext(false);

export function SubmitButton({
  children,
  pendingLabel,
  className = "a-btn",
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const status = useFormStatus();
  const pending = useContext(Pending) || status.pending;
  return (
    <button className={className} type="submit" disabled={pending} aria-busy={pending}>
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}

/** A submit button that asks before a destructive action. */
export function ConfirmButton({
  message,
  children,
  className = "a-btn a-btn-danger",
}: {
  message: string;
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/**
 * Form bound to a Server Function that returns a FormState, showing its message.
 * It dispatches by hand rather than through the action prop, so React does not
 * clear what was typed when the server reports a validation error.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  encType,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  children: ReactNode | ((state: FormState) => ReactNode);
  className?: string;
  resetOnSuccess?: boolean;
  encType?: "multipart/form-data";
}) {
  const [state, dispatch, pending] = useActionState(action, { status: "idle" } as FormState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status === "ok" && resetOnSuccess) form.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form
      ref={form}
      className={className}
      encType={encType}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => dispatch(data));
      }}
    >
      <Pending.Provider value={pending}>
        {typeof children === "function" ? children(state) : children}
      </Pending.Provider>
      {state.status !== "idle" && (
        <p
          key={state.at}
          className={`a-flash a-flash-${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
