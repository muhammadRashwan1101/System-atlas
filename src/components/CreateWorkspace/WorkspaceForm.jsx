import { FaRegCircleCheck } from "react-icons/fa6";
import { MdDomainAdd } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from 'react-toastify';
import useAuth from "../../context/AuthContext";
import { FaUser } from "react-icons/fa6";

export default function WorkspaceForm({formRef}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [error, setError] = useState(null);
  const {user, loading} = useAuth()

  console.log(user)
  const submitForm = async (data) => {
    try {
      const response = await api.post("/workspace", data);
      console.log(response.status)
      toast.success("Workspace created successfully")
    } catch (err) {
      const message = Array.isArray(err.response?.data?.msg) ? err.response?.data?.msg[0] : err.response?.data?.msg
      toast.error(message || "Unable to connect to the server")
      setError(message || "Unable to connect to the server");
    }
  }
  useEffect(() => {
      setTimeout(() => {  
        setError(null);
      }, 3000);
  
    }, [error]);

  return (
    <div className="flex flex-col w-full h-full p-5 ps-30 ">
      <div className="w-2/3 h-full">
        <div className="flex flex-col mb-8 gap-3">
          <div className="flex items-center gap-3">
            <MdDomainAdd className="w-7 h-7 text-(--primary)" />
            <h2 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
              Create Workspace
            </h2>
          </div>
          <p className="text-(--text)">
            Create an organizational boundary for architecture governance and
            ownership.
          </p>
        </div>
        <form ref={formRef} onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-8">
            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
              0.1 Workspace Information
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="workspaceName"
              className="text-(--text) font-(family-name:--labels) uppercase text-[10px]"
            >
              Workspace Name
            </label>
            <input
              type="text"
              id="workspaceName"
              name="workspaceName"
              placeholder="e.g. Fintech Division"
              {...register("name", {
                required: "Workspace name is required",
                minLength: {
                  value: 3,
                  message: "Workspace name must be at least 3 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Workspace name must be at most 50 characters",
                },
              })}
              className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transition-all ease-in-out duration-200 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] "
            />
            {errors.name && (<p className="text-red-500 text-xs">{errors.name.message}</p>)}
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="workspaceDescription"
              className="text-(--text) font-(family-name:--labels) uppercase text-[10px]"
            >
              Description
            </label>
            <textarea
              id="workspaceDescription"
              name="description"
              placeholder="Describe the purpose and scope of this boundary..."
              className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transition-all ease-in-out duration-200 resize-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
              rows={4}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Description must be at most 500 characters",
                },
              })}
            ></textarea>
            {errors.description && (<p className="text-red-500 text-xs">{errors.description.message}</p>)}
          </div>
          <div className="flex flex-col gap-4 mt-5">
            <div className="flex flex-col gap-8">
              <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                0.2 Workspace Owner
              </h2>
              <p className="text-xs text-(--text)">
                The selected owner will receive workspace administration
                privileges.
              </p>
            </div>
            <div className="flex items-center gap-7 bg-(--main-bg) rounded-lg p-3 px-7 w-fit shadow-[2px_2px_4px_rgba(0,0,0,0.6),-2px_-2px_4px_rgba(255,225,255,0.05)] hover:scale-[0.98] hover:brightness-80 transition-all ease-in-out duration-300">
              <div className="bg-(--secondary-bg) border border-(--border)/50 p-3 rounded-full">
                <FaUser className="w-6 h-6 text-white/80 " />
              </div>
              {loading ? (<p>Loading...</p>) : (
                <div className="flex flex-col gap-2 font-(family-name:--labels)">
                  <h3 className="uppercase">{user?.user?.name}</h3>
                  <h3 className="text-xs">{user?.user?.email}</h3>
                  <h3 className="uppercase text-xs text-(--tertiary)">Super Admin</h3>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                0.2 Workspace Summary Preview
              </h2>
              <p className="text-(--border) italic text-sm">
                Assets will appear after workspace creation
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-10">
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Projects
                </h3>
              </li>
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Teams
                </h3>
              </li>
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Components
                </h3>
              </li>
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Relationships
                </h3>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
