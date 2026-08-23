// src/pages/TeamManagement/TeamDetails.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiUsers,
  FiLayers,
  FiFolder,
  FiBookOpen,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";

import { toast } from "react-toastify";
import api from "../../api/axios";

// ======================================================
// Helpers
// ======================================================

const getUserName = (user) => {
  if (!user) return "Unknown User";

  // 1. fullName
  if (user.fullName?.trim()) {
    return user.fullName.trim();
  }

  // 2. displayName
  if (user.displayName?.trim()) {
    return user.displayName.trim();
  }

  // 3. firstName + lastName
  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";

  const combinedName = `${firstName} ${lastName}`.trim();

  if (combinedName) {
    return combinedName;
  }

  // 4. username
  if (user.username?.trim()) {
    return user.username.trim();
  }

  // IMPORTANT:
  // Don't use email as the main name.
  return "Unknown User";
};

const getUserInitial = (user) => {
  const name = getUserName(user);

  if (!name || name === "Unknown User") {
    return "U";
  }

  return name.charAt(0).toUpperCase();
};

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

    case "review":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";

    case "inactive":
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";

    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

const getCoverageColor = (coverage) => {
  if (coverage >= 80) return "bg-emerald-400";

  if (coverage >= 50) return "bg-emerald-500";

  return "bg-rose-500";
};

const getCoverageTextColor = (coverage) => {
  if (coverage >= 50) {
    return "text-emerald-400";
  }

  return "text-rose-400";
};

const formatRole = (role) => {
  if (!role) return "Member";

  return role
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

// ======================================================
// Member Row
// ======================================================

function MemberRow({ member }) {
  const name = getUserName(member);

  const email = member?.email || "No email";

  const role = formatRole(member?.role);

  return (
    <div
      className="
        flex
        items-center
        justify-between
        px-5
        py-4
        border-b
        border-slate-800/60
        last:border-b-0
        hover:bg-slate-800/20
        transition
      "
    >
      {/* User */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Avatar */}
        <div
          className="
            w-10
            h-10
            rounded-full
            bg-slate-800
            border
            border-slate-700
            flex
            items-center
            justify-center
            text-sm
            font-semibold
            text-slate-300
            shrink-0
            overflow-hidden
          "
        >
          {member?.avatar ? (
            <img
              src={member.avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            getUserInitial(member)
          )}
        </div>

        {/* User Info */}
        <div className="min-w-0">

          {/* NAME */}
          <p className="text-sm font-semibold text-slate-200 truncate">
            {name}
          </p>

          {/* EMAIL */}
          <div className="flex items-center gap-1.5 mt-1">

            <FiMail className="text-slate-600 text-xs shrink-0" />

            <p className="text-xs text-slate-500 truncate">
              {email}
            </p>

          </div>
        </div>
      </div>

      {/* Role */}
      <span
        className="
          px-2.5
          py-1
          rounded-md
          bg-slate-800
          border
          border-slate-700
          text-[10px]
          uppercase
          font-mono
          text-slate-400
          shrink-0
          ml-4
        "
      >
        {role}
      </span>
    </div>
  );
}

// ======================================================
// Stat Card
// ======================================================

function StatCard({ icon, label, value }) {
  return (
    <div
      className="
        bg-[#10131A]
        border
        border-slate-800
        rounded-xl
        p-5
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-wider
              font-semibold
              text-slate-500
            "
          >
            {label}
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-slate-100
              mt-2
            "
          >
            {value}
          </p>

        </div>

        <div
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800/70
            border
            border-slate-700
            flex
            items-center
            justify-center
            text-slate-400
          "
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

// ======================================================
// Main Component
// ======================================================

export default function TeamDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [team, setTeam] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);

  // ======================================================
  // Fetch Team
  // ======================================================

  const fetchTeam = async () => {
    if (!id) {
      setError("Team ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      setError("");

      const response = await api.get(`/teams/${id}`);

      const teamData =
        response.data?.data ||
        response.data?.team ||
        null;

      if (!teamData) {
        setError("Team not found.");
        return;
      }

      setTeam(teamData);

    } catch (err) {
      console.error("Failed to fetch team:", err);

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to load team details."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  // ======================================================
  // Team Data
  // ======================================================

  const members = useMemo(() => {
    return Array.isArray(team?.members)
      ? team.members
      : [];
  }, [team]);

  const membersCount = members.length;

  const componentsCount =
    team?.componentsCount ??
    (Array.isArray(team?.components)
      ? team.components.length
      : 0);

  const projectsCount =
    team?.projectsCount ??
    (Array.isArray(team?.projects)
      ? team.projects.length
      : 0);

  const documentationCoverage = Math.min(
    Math.max(
      Number(team?.documentationCoverage ?? 0),
      0
    ),
    100
  );

  const teamLead = team?.teamLead;

  const teamLeadName = getUserName(teamLead);

  const teamLeadEmail =
    teamLead?.email || "No email";

  // ======================================================
  // Actions
  // ======================================================

  const handleBack = () => {
    navigate("/teams");
  };

  const handleEdit = () => {
    navigate(`/teams/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!team?._id || deleting) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${team.teamName}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await api.delete(`/teams/${team._id}`);

      toast.success("Team deleted successfully.");

      navigate("/teams");

    } catch (err) {
      console.error("Failed to delete team:", err);

      toast.error(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Failed to delete team."
      );

    } finally {
      setDeleting(false);
    }
  };

  // ======================================================
  // Loading
  // ======================================================

  if (loading) {
    return (
      <main className="w-full min-h-screen px-8 py-8">

        <div className="flex items-center justify-center min-h-[500px]">

          <div className="flex items-center gap-3 text-slate-400">

            <div
              className="
                w-5
                h-5
                border-2
                border-emerald-500
                border-t-transparent
                rounded-full
                animate-spin
              "
            />

            <span className="text-sm">
              Loading team details...
            </span>

          </div>

        </div>

      </main>
    );
  }

  // ======================================================
  // Error
  // ======================================================

  if (error || !team) {
    return (
      <main className="w-full min-h-screen px-8 py-8">

        <button
          onClick={handleBack}
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-400
            hover:text-slate-200
            transition
            mb-6
          "
        >
          <FiArrowLeft />

          Back to Teams
        </button>

        <div
          className="
            min-h-[400px]
            rounded-2xl
            border
            border-rose-900/30
            bg-[#10131A]/60
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-6
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-rose-500/10
              border
              border-rose-500/20
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <FiAlertCircle className="text-rose-400 text-xl" />
          </div>

          <h2 className="text-lg font-semibold text-slate-200">
            Unable to load team
          </h2>

          <p className="text-sm text-rose-400 mt-2">
            {error || "Team not found."}
          </p>

          <div className="flex gap-3 mt-6">

            <button
              onClick={handleBack}
              className="
                px-4
                py-2
                rounded-lg
                border
                border-slate-800
                text-sm
                text-slate-300
                hover:bg-slate-800/50
                transition
              "
            >
              Back to Teams
            </button>

            <button
              onClick={fetchTeam}
              className="
                px-4
                py-2
                rounded-lg
                bg-slate-800
                hover:bg-slate-700
                text-sm
                text-slate-200
                transition
              "
            >
              Try Again
            </button>

          </div>
        </div>

      </main>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <main className="w-full min-h-screen px-8 py-6 pb-10">

      {/* ==================================================
          Top Navigation
      ================================================== */}

      <div className="flex items-center justify-between mb-6">

        <button
          onClick={handleBack}
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-400
            hover:text-slate-200
            transition
          "
        >
          <FiArrowLeft />

          Back to Teams
        </button>

        <div className="flex items-center gap-3">

          <button
            onClick={handleEdit}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-lg
              border
              border-slate-800
              bg-[#10131A]
              text-sm
              text-slate-300
              hover:bg-slate-800/60
              hover:text-slate-100
              transition
            "
          >
            <FiEdit3 />

            Edit Team
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-lg
              border
              border-rose-900/40
              bg-rose-500/5
              text-sm
              text-rose-400
              hover:bg-rose-500/10
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <FiTrash2 />

            {deleting ? "Deleting..." : "Delete Team"}
          </button>

        </div>
      </div>

      {/* ==================================================
          Team Header
      ================================================== */}

      <section
        className="
          bg-[#10131A]
          border
          border-slate-800
          rounded-2xl
          p-7
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-start
            lg:justify-between
            gap-6
          "
        >

          {/* Team Information */}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-3 mb-3">

              <span
                className="
                  px-2.5
                  py-1
                  rounded-md
                  bg-slate-800
                  border
                  border-slate-700
                  text-xs
                  font-mono
                  font-semibold
                  text-slate-400
                "
              >
                {team.teamCode || "N/A"}
              </span>

              <span
                className={`
                  px-2.5
                  py-1
                  rounded-md
                  border
                  text-xs
                  uppercase
                  font-mono
                  font-semibold
                  ${getStatusStyle(team.status)}
                `}
              >
                {team.status || "ACTIVE"}
              </span>

              {team.category && (
                <span
                  className="
                    px-2.5
                    py-1
                    rounded-md
                    bg-slate-800/70
                    border
                    border-slate-700
                    text-xs
                    text-slate-400
                  "
                >
                  {team.category}
                </span>
              )}

            </div>

            <h1
              className="
                text-3xl
                font-bold
                text-slate-100
                tracking-tight
              "
            >
              {team.teamName || "Unnamed Team"}
            </h1>

            <p
              className="
                text-sm
                text-slate-400
                mt-3
                max-w-3xl
                leading-relaxed
              "
            >
              {team.description ||
                "No team description has been provided."}
            </p>

          </div>

          {/* Team Lead */}

          <div className="lg:min-w-[250px]">

            <p
              className="
                text-[10px]
                uppercase
                tracking-wider
                font-semibold
                text-slate-500
                mb-3
              "
            >
              TECH LEAD
            </p>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-slate-800
                  border
                  border-slate-700
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-semibold
                  text-slate-300
                  overflow-hidden
                "
              >
                {teamLead?.avatar ? (
                  <img
                    src={teamLead.avatar}
                    alt={teamLeadName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getUserInitial(teamLead)
                )}
              </div>

              <div className="min-w-0">

                {/* NAME */}
                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-200
                    truncate
                  "
                >
                  {teamLeadName}
                </p>

                {/* EMAIL */}
                <p
                  className="
                    text-xs
                    text-slate-500
                    mt-1
                    truncate
                  "
                >
                  {teamLeadEmail}
                </p>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          Statistics
      ================================================== */}

      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
          mt-6
        "
      >

        <StatCard
          icon={<FiUsers />}
          label="Members"
          value={membersCount}
        />

        <StatCard
          icon={<FiLayers />}
          label="Components"
          value={componentsCount}
        />

        <StatCard
          icon={<FiFolder />}
          label="Projects"
          value={projectsCount}
        />

        <StatCard
          icon={<FiBookOpen />}
          label="Documentation"
          value={`${documentationCoverage}%`}
        />

      </section>

      {/* ==================================================
          Team Members - FULL WIDTH
      ================================================== */}

      <section
        className="
          bg-[#10131A]
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
          mt-6
        "
      >

        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-slate-800/70
          "
        >

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-slate-200
              "
            >
              Team Members
            </h2>

            <p
              className="
                text-xs
                text-slate-500
                mt-1
              "
            >
              People currently assigned to this team.
            </p>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
            "
          >
            <FiUsers />

            {membersCount} Members
          </div>

        </div>

        {/* Members */}

        <div>

          {members.length === 0 ? (

            <div
              className="
                py-14
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-6
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-slate-800/70
                  border
                  border-slate-700
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >
                <FiUsers className="text-slate-500 text-xl" />
              </div>

              <p
                className="
                  text-sm
                  font-medium
                  text-slate-300
                "
              >
                No members yet
              </p>

              <p
                className="
                  text-xs
                  text-slate-500
                  mt-1
                "
              >
                This team does not have any assigned members.
              </p>

            </div>

          ) : (

            members.map((member) => (
              <MemberRow
                key={member._id}
                member={member}
              />
            ))

          )}

        </div>
      </section>

      {/* ==================================================
          Documentation Coverage - FULL WIDTH
      ================================================== */}

      <section
        className="
          bg-[#10131A]
          border
          border-slate-800
          rounded-2xl
          p-6
          mt-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-4
          "
        >

          <div>

            <h2
              className="
                text-base
                font-semibold
                text-slate-200
              "
            >
              Documentation Coverage
            </h2>

            <p
              className="
                text-xs
                text-slate-500
                mt-1
              "
            >
              Documentation completeness across team components.
            </p>

          </div>

          <span
            className={`
              text-lg
              font-bold
              ${getCoverageTextColor(
                documentationCoverage
              )}
            `}
          >
            {documentationCoverage}%
          </span>

        </div>

        <div
          className="
            w-full
            h-2
            bg-slate-800
            rounded-full
            overflow-hidden
          "
        >

          <div
            className={`
              h-full
              rounded-full
              transition-all
              duration-500
              ${getCoverageColor(
                documentationCoverage
              )}
            `}
            style={{
              width: `${documentationCoverage}%`,
            }}
          />

        </div>

        <div
          className="
            flex
            justify-between
            mt-3
            text-[10px]
            text-slate-600
            uppercase
            tracking-wider
          "
        >
          <span>0%</span>

          <span>50%</span>

          <span>100%</span>
        </div>

      </section>

      {/* ==================================================
          Team Information
      ================================================== */}

      <section
        className="
          bg-[#10131A]
          border
          border-slate-800
          rounded-2xl
          p-6
          mt-6
        "
      >

        <h2
          className="
            text-base
            font-semibold
            text-slate-200
            mb-5
          "
        >
          Team Information
        </h2>

        <div className="space-y-4">

          {/* Team Code */}

          <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-slate-500">
              Team Code
            </span>

            <span className="text-xs font-mono text-slate-300">
              {team.teamCode || "N/A"}
            </span>

          </div>

          <div className="h-px bg-slate-800/70" />

          {/* Category */}

          <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-slate-500">
              Category
            </span>

            <span className="text-xs text-slate-300">
              {team.category || "N/A"}
            </span>

          </div>

          <div className="h-px bg-slate-800/70" />

          {/* Status */}

          <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-slate-500">
              Status
            </span>

            <span
              className={`
                px-2
                py-1
                rounded
                border
                text-[10px]
                uppercase
                font-mono
                ${getStatusStyle(team.status)}
              `}
            >
              {team.status || "ACTIVE"}
            </span>

          </div>

          <div className="h-px bg-slate-800/70" />

          {/* Team Lead */}

          <div className="flex items-center justify-between gap-4">

            <span className="text-xs text-slate-500">
              Team Lead
            </span>

            <span className="text-xs text-slate-300">
              {teamLeadName}
            </span>

          </div>

        </div>

      </section>

      {/* ==================================================
          Quick Actions
      ================================================== */}

      <section
        className="
          bg-[#10131A]
          border
          border-slate-800
          rounded-2xl
          p-6
          mt-6
        "
      >

        <h2
          className="
            text-base
            font-semibold
            text-slate-200
            mb-4
          "
        >
          Quick Actions
        </h2>

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-3
          "
        >

          <button
            onClick={handleEdit}
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
              rounded-lg
              bg-slate-800/60
              border
              border-slate-700
              text-sm
              text-slate-300
              hover:bg-slate-800
              hover:text-slate-100
              transition
            "
          >

            <span className="flex items-center gap-2">
              <FiEdit3 />

              Edit Team
            </span>

            <span>→</span>

          </button>

          <button
            onClick={handleBack}
            className="
              flex
              items-center
              justify-between
              px-4
              py-3
              rounded-lg
              bg-slate-800/30
              border
              border-slate-800
              text-sm
              text-slate-400
              hover:bg-slate-800/60
              hover:text-slate-200
              transition
            "
          >

            <span className="flex items-center gap-2">
              <FiArrowLeft />

              All Teams
            </span>

            <span>→</span>

          </button>

        </div>

      </section>

    </main>
  );
}