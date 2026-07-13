import logo from "../../../assets/Container.png";
import { Link } from "react-router-dom";
import background from "../../../assets/background-login.png";
import A_logo from "../../../assets/Atlas-Logo.png";
import graph from "../../../assets/START_ANIMATION.png";
import login_icon from "../../../assets/login-icon.png";
import footer_login from "../../../assets/Footer_login.png";
import styles from "./login.module.css";
import api from "../../../api/axios";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      console.log(response.data);
      if (!response.data.token) {
        setError(response.data.msg);
        return;
      }

      localStorage.setItem("token", response.data.token);
      navigate("/new-workspace");
    } catch (err) {
      setError(err.response.data.msg || "Unable to connect to the server");
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, [error]);
  const stats = [
    {
      value: "132",
      label: "COMPONENTS INDEXED",
      color: "bg-emerald-400",
    },
    {
      value: "486",
      label: "RELATIONSHIPS MAPPED",
      color: "bg-blue-300",
    },
    {
      value: "12",
      label: "TEAMS CONNECTED",
      color: "bg-emerald-400",
    },
    {
      value: "99.98%",
      label: "AVAILABILITY",
      color: "bg-emerald-400",
    },
  ];
  const footerStatus = [
    "PRODUCTION ENVIRONMENT",
    "US-EAST-1",
    "HOMOGOOD CONNECTED",
    "REDIS HEALTHY",
    "API GATEWAY ONLINE",
  ];
  return (
    <div
      id={styles.container}
      className="flex min-h-screen"
      style={{
        backgroundImage: `
      linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3)),
      url(${background})
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-[60%] min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="mb-4 ">
          <div className="mb-4">
            <Link to="/">
            <img src={A_logo} alt="logo company" className="rounded-xl" />
            </Link>
          </div>
          </div>
          <h1 className="my-6 text-4xl font-semibold text-[#D8E2FF]">
            Visualize Your Architecture
          </h1>
          <p>The living map of your software ecosystem.</p>
          <div className="my-9 ">
            <img src={graph} />
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-slate-700 bg-[#161B22] px-3 py-2 shadow-lg "
              >
                <span
                  className={`h-2 w-2 rounded-full ${item.color} shadow-[0_0_10px_rgba(74,222,128,0.9)] `}
                ></span>

                <span className="text-gray-300 text-xs tracking-[0.15em] uppercase">
                  <span className="mr-2 text-white">{item.value}</span>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <footer className="flex justify-center gap-8 py-3 flex-wrap bg-[#0B0F17]">
          {footerStatus.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]"></span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                {" "}
                {item}
              </span>
            </div>
          ))}
        </footer>
      </div>

      <div className="w-[40%] bg-[#0B0F17] flex items-center justify-center">
        <div className=" w-full max-w-md flex flex-col items-center gap-4  px-8  ">
          <div className="flex flex-col gap-2 self-start">
            <h2 className="text-2xl font-medium text-(--text)">
              Infrastructure Access
            </h2>
            <p className="text-sm mb-5">
              Secure entry for architecture intelligence
            </p>
          </div>

          {error && <span className="text-sm text-red-500">{error}</span>}
          <form
            className="flex flex-col gap-7 w-full"
            onSubmit={handleSubmit(handleLogin)}
          >
            <div className="flex flex-col gap-5">
              <label
                className="font-(family-name:--labels) text-xs text-[#64748B]"
                htmlFor="email"
              >
                Organization Email
              </label>
              <input
                className="p-3 bg-[#FFFFFF] rounded-sm focus:outline-none placeholder:text-(--border) text-(--border)"
                id="email"
                type="text"
                placeholder="example@email.com"
                {...register("email", {
                  required: "Please Enter your Email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-sm text-[#fc3636]">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-5">
              <div>
                <label
                  className="font-(family-name:--labels) text-[#64748B]  text-[11px] "
                  htmlFor="password"
                >
                  Security Key
                </label>
                <Link
                  to="/"
                  className="text-xs text-[#D8E2FFB2] hover:text-(--primary)/80 float-right"
                >
                  RECOVERY
                </Link>
              </div>
              <input
                className="w-full p-3 bg-[#FFFFFF] rounded-sm focus:outline-none placeholder:text-(--border) text-(--border)"
                id="password"
                type="password"
                defaultValue="password"
                placeholder="Enter Your Password"
                {...register("password", {
                  required: "Please Enter Your Password",
                })}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-blue-600"
              />

              <label htmlFor="remember" className="text-sm text-[#94A3B8]">
                Trusted device authentication
              </label>
            </div>
            <button
              className="bg-[#ADC6FF] p-5 rounded-md text-[#385283] font-semibold hover:bg-[#ADC6FF]/80 mt-3 flex justify-center gap-3"
              type="submit"
            >
              AUTHORIZE ENTRY
              <img src={login_icon} alt="" />
            </button>
          </form>
          <div className="flex flex-col gap-5 my-4 pt-5 justify-center items-center">
            <span className="text-[#64748B] font-light">
              ENTERPRISE ACCESS RESTRICTED
            </span>
            <img src={footer_login} c />
          </div>
        </div>
      </div>
    </div>
  );
}
