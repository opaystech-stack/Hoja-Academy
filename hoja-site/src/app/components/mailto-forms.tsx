"use client";
// Formulaires honnêtes : ce site est un export statique, sans backend.
// Chaque formulaire compose un mailto: prérempli puis ouvre la messagerie de l'utilisateur.
// Aucune donnée n'est envoyée ni stockée par le site.
import { useState, type FormEvent } from "react";

const EMAIL = "info@hoja-academy.com";
const NOTA =
  "Votre messagerie s'ouvre avec votre message prérempli — aucune donnée n'est stockée sur ce site.";

function openMailto(subject: string, lines: string[]) {
  const body = lines.filter(Boolean).join("\n");
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const labelCls =
  "block mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-color-001";
const fieldCls =
  "w-full rounded-[14px] border border-solid border-black/15 bg-white px-4 py-3 text-sm text-color-001 outline-none focus:border-primary";
const btnCls =
  "inline-block py-[0.9375rem] px-7.5 rounded-[60px] text-color-001 [font-family:Montserrat,_sans-serif] text-[0.9375rem] font-semibold text-center bg-primary cursor-pointer hover:opacity-90";
const notaCls = "mt-4 text-[0.8125rem] leading-5 text-color-001/70";

function Nota() {
  return (
    <p className={notaCls} role="status">
      {NOTA}
    </p>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [type, setType] = useState("Formation individuelle");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    openMailto("Contact site", [
      `Nom : ${name}`,
      `Email : ${email}`,
      `Organisation : ${org}`,
      `Type de demande : ${type}`,
      `Message : ${message}`,
    ]);
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
      <div>
        <label className={labelCls} htmlFor="cf-name">Nom</label>
        <input id="cf-name" className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
      </div>
      <div>
        <label className={labelCls} htmlFor="cf-email">Email</label>
        <input id="cf-email" type="email" className={fieldCls} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div>
        <label className={labelCls} htmlFor="cf-org">Organisation</label>
        <input id="cf-org" className={fieldCls} value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" />
      </div>
      <div>
        <label className={labelCls} htmlFor="cf-type">Type de demande</label>
        <select id="cf-type" className={fieldCls} value={type} onChange={(e) => setType(e.target.value)}>
          <option>Formation individuelle</option>
          <option>Formation pour une équipe</option>
          <option>Accompagnement entreprise</option>
          <option>Projet institutionnel</option>
          <option>Projet de recherche</option>
          <option>Candidature</option>
          <option>Autre</option>
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="cf-msg">Message</label>
        <textarea id="cf-msg" rows={5} className={fieldCls} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </div>
      <div>
        <button type="submit" className={btnCls}>Envoyer par e-mail</button>
      </div>
      <Nota />
    </form>
  );
}

export function CandidatureForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [org, setOrg] = useState("");
  const [domain, setDomain] = useState("Expert IA");
  const [motivation, setMotivation] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    openMailto("Candidature Hoja Academy", [
      `Nom : ${name}`,
      `Email : ${email}`,
      `Téléphone / WhatsApp : ${phone}`,
      `Profession : ${job}`,
      `Organisation : ${org}`,
      `Domaine d'intérêt : ${domain}`,
      `Motivation : ${motivation}`,
    ]);
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
      <div>
        <label className={labelCls} htmlFor="pf-name">Nom</label>
        <input id="pf-name" className={fieldCls} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
      </div>
      <div>
        <label className={labelCls} htmlFor="pf-email">Email</label>
        <input id="pf-email" type="email" className={fieldCls} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </div>
      <div>
        <label className={labelCls} htmlFor="pf-phone">Téléphone / WhatsApp</label>
        <input id="pf-phone" type="tel" className={fieldCls} value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" />
      </div>
      <div>
        <label className={labelCls} htmlFor="pf-job">Profession</label>
        <input id="pf-job" className={fieldCls} value={job} onChange={(e) => setJob(e.target.value)} autoComplete="organization-title" />
      </div>
      <div>
        <label className={labelCls} htmlFor="pf-org">Organisation</label>
        <input id="pf-org" className={fieldCls} value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" />
      </div>
      <div>
        <label className={labelCls} htmlFor="pf-domain">Domaine d'intérêt</label>
        <select id="pf-domain" className={fieldCls} value={domain} onChange={(e) => setDomain(e.target.value)}>
          <option>Expert IA</option>
          <option>Automatisation &amp; n8n</option>
          <option>Robotique &amp; IA</option>
          <option>Recherche &amp; Sciences</option>
          <option>Autre</option>
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="pf-msg">Motivation</label>
        <textarea id="pf-msg" rows={5} className={fieldCls} value={motivation} onChange={(e) => setMotivation(e.target.value)} required />
      </div>
      <div>
        <button type="submit" className={btnCls}>Envoyer ma candidature</button>
      </div>
      <Nota />
    </form>
  );
}
