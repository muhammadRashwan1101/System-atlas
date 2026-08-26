import {
  FiCpu,
  FiTerminal,
} from "react-icons/fi";
import { BsDatabase } from "react-icons/bs";
import { MdOutlineHub } from "react-icons/md";
import { CgScreen } from "react-icons/cg";
import { BiCreditCard } from "react-icons/bi";

export default function ComponentIcon({ iconType, className = "text-base text-sky-300" }) {
  switch (iconType) {
    case "database":
      return <BsDatabase className={className} />;
    case "hub":
      return <MdOutlineHub className="text-lg text-sky-300" />;
    case "screen":
      return <CgScreen className="text-lg text-sky-300" />;
    case "terminal":
      return <FiTerminal className={className} />;
    case "card":
      return <BiCreditCard className="text-lg text-sky-300" />;
    case "brain":
    default:
      return <FiCpu className={className} />;
  }
}
