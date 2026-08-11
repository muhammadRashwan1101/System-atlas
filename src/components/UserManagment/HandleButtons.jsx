import { useState } from "react";
import useDeleteUser from "../../hooks/useDeleteUser";
import useSuspendUser from "../../hooks/useSuspendUser";

export default function HandleButtons({
  selectedUser,
  onClose,
  onUserDeleted,
  onUserUpdated,
}) {
  const { deleteUser, deleting, error } = useDeleteUser();
  const { suspendUser, suspending, error: suspendError } = useSuspendUser();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const success = await deleteUser(selectedUser._id);
    if (success) {
      onUserDeleted?.(selectedUser._id);
      onClose?.();
    }
    setConfirmOpen(false);
  };
  const handleSuspendClick = async () => {
    const newStatus = await suspendUser(selectedUser._id);
    if (newStatus) {
      onUserUpdated?.(selectedUser._id, { accountStatus: newStatus });
    }
  };
  const isSuspended = selectedUser.accountStatus === "suspended";
  return (
    <div className="bg-[#0D0E11] p-8 border-t border-[#2D303A]">
      <div className="flex gap-3 mb-3 text-[#E3E2E7]">
        <button className="flex-1 bg-[#191B23] border border-[#2D303A] py-2 text-sm">
          Reset Password
        </button>
        <button
          onClick={handleSuspendClick}
          disabled={suspending}
          className="flex-1 bg-[#191B23] border border-[#2D303A] py-2 text-sm disabled:opacity-50"
        >
          {suspending ? "..." : isSuspended ? "Reactivate" : "Suspend"}
        </button>
      </div>
      {suspendError && (
          <p className="text-[#FF8A80] text-xs mb-3">{suspendError}</p>
        )}

      {!confirmOpen ? (
        <button
          onClick={handleDeleteClick}
          className="w-full bg-[#FF8A801A] border border-[#FF8A8033] text-[#FF8A80] py-2 text-sm"
        >
          Delete User
        </button>
      ) : (
        <div className="border border-[#FF8A8033] rounded-md p-3 bg-[#FF8A800D]">
          <p className="text-[#FF8A80] text-xs mb-3">
            Are you sure you want to permanently delete {selectedUser.fullName}?
            This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="flex-1 bg-[#FF8A80] text-[#0D0E11] py-1.5 text-sm rounded disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete User"}
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
              className="flex-1 bg-[#191B23] border border-[#2D303A] py-1.5 text-sm rounded"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-[#FF8A80] text-xs mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
