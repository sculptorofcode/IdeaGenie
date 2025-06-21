import React, { useEffect, useState } from "react";
import { TeamMember, generateMembersArray } from "./formHelpers";

type Step3Props = {
  teamMembers: number | "";
  setTeamMembers: (value: number | "") => void;
  teamName: string;
  setTeamName: (value: string) => void;
  members: TeamMember[];
  setMembers: (members: TeamMember[]) => void;
  nextStep: () => void;
  prevStep: () => void;
};

const Step3: React.FC<Step3Props> = ({
  teamMembers,
  setTeamMembers,
  teamName,
  setTeamName,
  members,
  setMembers,
  nextStep,
  prevStep,
}) => {
  const memberCount = typeof teamMembers === 'number' ? teamMembers : 3;

  useEffect(() => {
    if (typeof teamMembers === 'number' && (members.length !== teamMembers)) {
      setMembers(generateMembersArray(teamMembers));
    }
  }, [teamMembers, members.length, setMembers]);

  const updateMember = (id: number, field: keyof TeamMember, value: string) => {
    setMembers(
      members.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const generateRoadmap = () => {
    if (teamName.trim() === '') {
      alert('Please enter a team name');
      return;
    }
    nextStep();
  };

  return (
    <div className="step-content active" id="step3">
      <h1 className="step-title">Team Setup</h1>
      <div className="form-group">
        <label className="form-label">Team Name</label>
        <input
          type="text"
          className="form-control"
          id="teamName"
          placeholder="Enter your team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Number of Team Members</label>
        <input
          type="number"
          className="form-control"
          id="memberCount"
          min={1}
          max={10}
          value={teamMembers}
          onChange={(e) => {
            const value = e.target.value;
            setTeamMembers(value === "" ? "" : Math.min(10, Math.max(1, Number(value))));
          }}
        />
      </div>      <div id="teamMembersContainer" className="team-container">
        <div className="team-members">
          {members.map((member) => (
            <div className="team-card" key={member.id}>
              <h3><i className="fas fa-user"></i> Member {member.id}</h3>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control member-input"
                  placeholder="Full name"
                  value={member.name}
                  onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control member-input"
                  placeholder="Skills (comma separated)"
                  value={member.skills}
                  onChange={(e) => updateMember(member.id, 'skills', e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control member-input"
                  placeholder="Role/Responsibilities"
                  value={member.role}
                  onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>      <div className="navigation navigation-responsive">
        <button className="btn btn-outline" onClick={prevStep}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <button className="btn btn-accent" onClick={generateRoadmap}>
          <i className="fas fa-magic"></i> Generate Roadmap
        </button>
      </div>
    </div>
  );
};

export default Step3;
