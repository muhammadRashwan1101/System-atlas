import {
  MdOutlineRocketLaunch,
  MdOutlineLayers,
  MdTerminal,
  MdOutlineGrid4X4,
  MdOutlineHub,
} from "react-icons/md";

import { AiFillCodeSandboxSquare } from "react-icons/ai";
import { GoZap } from "react-icons/go";

export const TARGET_ENVIRONMENT_OPTIONS = [
  {
    title: "Production Ready",
    value: "production ready",
    icon: MdOutlineRocketLaunch,
  },
  {
    title: "Prototype",
    value: "prototype",
    icon: MdOutlineLayers,
  },
  {
    title: "Development",
    value: "development",
    icon: MdTerminal,
  },
];

export const TOPOLOGY_OPTIONS = [
  {
    title: "Monolithic",
    value: "monolithic",
    icon: AiFillCodeSandboxSquare,
  },
  {
    title: "Microservices",
    value: "microservices",
    icon: MdOutlineHub,
  },
  {
    title: "Event Driven",
    value: "event driven",
    icon: GoZap,
  },
  {
    title: "Hybrid",
    value: "hybrid",
    icon: MdOutlineGrid4X4,
  },
];

export const departmentOptions = [
    {
        value: "Platform",
        label: "Platform",
    },
    {
        value: "Frontend",
        label: "Frontend",
    },
    {
        value: "Backend",
        label: "Backend",
    },
    {
        value: "DevOps",
        label: "DevOps",
    },
    {
        value: "Cloud",
        label: "Cloud",
    },
    {
        value: "Mobile",
        label: "Mobile",
    },
    {
        value: "Security",
        label: "Security",
    },
    {
        value: "Data Science",
        label: "Data Science",
    },
    {
        value: "AI/ML",
        label: "AI/ML",
    },
    {
        value: "UI/UX",
        label: "UI/UX",
    },
    {
        value: "QA",
        label: "QA",
    },
    {
        value: "Other",
        label: "Other",
    },
];