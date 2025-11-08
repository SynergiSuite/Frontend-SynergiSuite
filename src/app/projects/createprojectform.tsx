"use client";
import React, { useState } from "react";
import ModalHeader from "./createprojectformheader";
import ProjectNameSection from "./createprojectnamesection";
import ClientInformationSection from "./clientinformationsection";
import ProjectDetailsSection from "./createprojectprojectdetailsection";
import ModalFooter from "./createprojectformfooter";

interface NewProjectModalProps {
  onCancel: () => void;
}

export default function NewProjectModal({ onCancel }: NewProjectModalProps) {
  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <ModalHeader />
        <ProjectNameSection />
        <ClientInformationSection />
        <ProjectDetailsSection />
        <ModalFooter onCancel={onCancel} />
      </div>
    </div>
    </>
  );
}