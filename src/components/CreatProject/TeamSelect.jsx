import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

import api from "../../api/axios";

import reactSelectClasses from "./reactSelectClasses";

export default function TeamSelect({
    selectedDepartments,
    value,
    onChange,
    setProjectSummary,
}) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    // =====================================================
    // Fetch Teams
    // =====================================================

    useEffect(() => {
        const fetchTeams = async () => {
            if (
                !selectedDepartments ||
                selectedDepartments.length === 0
            ) {
                setTeams([]);
                onChange([]);
                return;
            }

            try {
                setLoading(true);

                const categories =
                    selectedDepartments.map(
                        (department) =>
                            department.value
                    );

                const response = await api.get(
                    "/teams/by-category",
                    {
                        params: {
                            category:
                                categories.join(","),
                        },
                    }
                );

                const fetchedTeams =
                    response.data?.data ||
                    response.data?.teams ||
                    [];

                setTeams(fetchedTeams);

                // =================================================
                // Remove teams whose department was unselected
                // =================================================

                const validTeams =
                    value.filter((team) =>
                        categories.includes(
                            team.category
                        )
                    );

                onChange(validTeams);

                setProjectSummary((prev) => ({
                    ...prev,
                    ownerTeams:
                        validTeams.map(
                            (team) => team.value
                        ),
                }));
            } catch (error) {
                console.error(
                    "Fetch teams error:",
                    error
                );

                toast.error(
                    error.response?.data?.msg ||
                        "Failed to load teams"
                );

                setTeams([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();

        // intentionally based on departments only
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartments]);

    // =====================================================
    // Convert Teams to React Select Options
    // =====================================================

    const teamOptions = useMemo(() => {
        return teams.map((team) => ({
            value: team._id,
            label: team.teamName,
            category: team.category,
            teamCode: team.teamCode,
            description: team.description,
        }));
    }, [teams]);

    // =====================================================
    // Handle Team Selection
    // =====================================================

    const handleChange = (selected) => {
        const values = selected || [];

        onChange(values);

        setProjectSummary((prev) => ({
            ...prev,

            ownerTeams: values.map(
                (team) => team.value
            ),
        }));
    };

    // =====================================================
    // Render
    // =====================================================

    return (
        <div className="flex flex-col gap-2">

            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm ms-2">
                Teams
            </label>

            <Select
                unstyled
                isMulti

                options={teamOptions}

                value={value}

                onChange={handleChange}

                isDisabled={
                    selectedDepartments.length === 0
                }

                isLoading={loading}

                placeholder={
                    selectedDepartments.length === 0
                        ? "Select Departments first..."
                        : "Select Teams..."
                }

                closeMenuOnSelect={false}
                blurInputOnSelect={false}
                hideSelectedOptions={false}

                classNames={
                    reactSelectClasses
                }

                noOptionsMessage={() =>
                    loading
                        ? "Loading teams..."
                        : "No teams found for selected departments"
                }

                formatOptionLabel={(team) => (
                    <div className="flex flex-col">

                        <div className="flex items-center justify-between gap-3">

                            <span className="font-medium">
                                {team.label}
                            </span>

                            <span className="text-xs opacity-60">
                                {team.teamCode}
                            </span>

                        </div>

                        <span className="text-xs opacity-60">
                            {team.category}
                        </span>

                    </div>
                )}
            />

            {selectedDepartments.length === 0 && (
                <p className="text-xs text-(--text) opacity-60 ms-2">
                    Select one or more departments to see
                    their teams.
                </p>
            )}

        </div>
    );
}