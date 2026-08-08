import TeamCard from "./TeamCard";
import AddTeamCard from "./AddTeamCard";
export default function TeamGrid() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <TeamCard />
      <TeamCard />
      <TeamCard />
      <TeamCard />
      <TeamCard />
      <TeamCard />
      <AddTeamCard />
    </div>
  );
}