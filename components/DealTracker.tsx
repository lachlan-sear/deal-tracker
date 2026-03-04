"use client";

import { useState, useMemo, Fragment } from "react";
import companiesData from "@/data/companies.json";

interface Company {
  id: number;
  name: string;
  sector: string;
  description: string;
  stage: string;
  geo: string;
  founded: number | null;
  raised: string;
  investors: string;
  founderAccess: boolean;
  networkAccess: boolean;
  status: string;
  thesis: string;
  url: string;
  website: string;
  contactName?: string;
  contactLinkedIn?: string;
  dateAdded?: string;
}

const SECTOR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Vertical AI": { bg: "#e6f4ef", text: "#0d6e4e", border: "#c4e5d8" },
  "Horizontal AI": { bg: "#e8f0fe", text: "#1a56db", border: "#c5d9f9" },
  "AI Infrastructure": { bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
  "Deep Tech & Defence": { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },
  "—": { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db" },
};

const TABS = [
  "All",
  "Written Up",
  "Founder Access",
  "Vertical AI",
  "Horizontal AI",
  "AI Infrastructure",
  "Deep Tech & Defence",
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Written Up": { bg: "#15803d", text: "#FFFFFF", border: "#15803d" },
  Benchmark: { bg: "#1a56db", text: "#FFFFFF", border: "#1a56db" },
  Tracking: { bg: "#f3f4f6", text: "#9CA3AF", border: "#e5e7eb" },
};

const STATUS_PRIORITY: Record<string, number> = {
  "Written Up": 0,
  Benchmark: 1,
  Tracking: 2,
};

const STAGE_ORDER: Record<string, number> = {
  "Pre-Seed": 0,
  Seed: 1,
  "Series A": 2,
  "Series B": 3,
  "Series C": 4,
  "Series D": 5,
  "Series E": 6,
  "Series F": 7,
  Launch: 8,
};

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const isNew = (dateAdded?: string) => {
  if (!dateAdded) return false;
  const added = new Date(dateAdded);
  const now = new Date();
  const diffDays = (now.getTime() - added.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 14;
};

export default function DealTracker() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const companies = companiesData as Company[];

  const sortCompanies = (list: Company[]) => {
    return [...list].sort((a, b) => {
      // 1. Status: Written Up first, then Tracking
      const sp = (STATUS_PRIORITY[a.status] ?? 1) - (STATUS_PRIORITY[b.status] ?? 1);
      if (sp !== 0) return sp;
      // 2. Founder access: true before false
      if (a.founderAccess !== b.founderAccess) return a.founderAccess ? -1 : 1;
      // 3. Stage: earliest first (Seed before Series A before Series B)
      const sa = STAGE_ORDER[a.stage] ?? 99;
      const sb = STAGE_ORDER[b.stage] ?? 99;
      if (sa !== sb) return sa - sb;
      // 4. Alphabetical fallback
      return a.name.localeCompare(b.name);
    });
  };

  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    if (activeTab === "Written Up") {
      result = result.filter((c) => c.status === "Written Up");
    } else if (activeTab === "Founder Access") {
      result = result.filter((c) => c.founderAccess && c.status !== "Benchmark");
    } else if (activeTab !== "All") {
      result = result.filter((c) => c.sector === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.investors.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q)
      );
    }

    return sortCompanies(result);
  }, [companies, activeTab, searchQuery]);

  const stats = useMemo(() => {
    return {
      companies: companies.length,
      sectors: new Set(companies.map((c) => c.sector).filter((s) => s !== "—")).size,
      writeUps: companies.filter((c) => c.status === "Written Up").length,
      founderAccess: companies.filter((c) => c.founderAccess && c.status !== "Benchmark").length,
    };
  }, [companies]);

  const getTabCount = (tab: string) => {
    if (tab === "All") return companies.length;
    if (tab === "Written Up") return companies.filter((c) => c.status === "Written Up").length;
    if (tab === "Founder Access") return companies.filter((c) => c.founderAccess && c.status !== "Benchmark").length;
    return companies.filter((c) => c.sector === tab).length;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFFFFF",
        color: "#1A1A1A",
        fontFamily: "'IBM Plex Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header — Eton blue */}
      <div style={{ backgroundColor: "#E7F3E9", padding: "24px 24px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Title row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  margin: 0,
                  fontFamily: "'Lora', serif",
                }}
              >
                The Searing List
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  margin: "4px 0 0",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                Where I&apos;m building conviction across the AI stack.
              </p>
              <a
                href="https://lachlansear.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "#71717a",
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: 2,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                lachlansear.com
              </a>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies..."
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #C0C0C0",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#1A1A1A",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 14,
                outline: "none",
                width: 260,
                minWidth: 0,
                flex: "0 1 260px",
                marginTop: 4,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#8cc49a")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#C0C0C0")}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              marginBottom: 24,
            }}
            className="stats-grid"
          >
            {[
              { label: "Companies", value: stats.companies },
              { label: "Sectors", value: stats.sectors },
              { label: "Investment Memos", value: stats.writeUps },
              { label: "Founder Access", value: stats.founderAccess },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D4E8D8",
                  borderRadius: 8,
                  padding: "12px 20px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 500,
                    marginBottom: 4,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#1A1A1A",
                    fontFamily: "'Lora', serif",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 2,
              paddingBottom: 12,
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="tabs-scroll"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              const count = getTabCount(tab);

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    backgroundColor: isActive ? "#FFFFFF" : "transparent",
                    color: isActive ? "#1A1A1A" : "#6B7280",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    flexShrink: 0,
                  }}
                >
                  {tab}
                  <span
                    style={{
                      color: isActive ? "#6B7280" : "#9CA3AF",
                      fontSize: 11,
                      marginLeft: 5,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content — White */}
      <div style={{ flex: 1, padding: "0 24px", backgroundColor: "#FFFFFF" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 8 }}>
          {/* Desktop Table */}
          <div className="desktop-table" style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  {["Company", "Sector", "Description", "Stage", "HQ", "Raised", "Status", "Founder Access", ""].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: h === "Founder Access" ? "center" : "left",
                        padding: "10px 12px",
                        color: "#6B7280",
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => {
                  const sectorColor = SECTOR_COLORS[company.sector] || SECTOR_COLORS["—"];
                  const statusStyle = STATUS_STYLES[company.status] || STATUS_STYLES["Tracking"];
                  const isExpanded = expandedId === company.id;

                  return (
                    <Fragment key={company.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : company.id)}
                        style={{
                          borderBottom: isExpanded ? "none" : "1px solid #F3F4F6",
                          cursor: "pointer",
                          backgroundColor: isExpanded ? "#f8faf8" : "transparent",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = "#f8faf8";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <span>{company.name}</span>
                            {isNew(company.dateAdded) && (
                              <span style={{
                                fontSize: 9,
                                fontWeight: 600,
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                color: "#dc2626",
                                backgroundColor: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: 4,
                                padding: "1px 5px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                lineHeight: "16px",
                                whiteSpace: "nowrap",
                              }}>
                                New
                              </span>
                            )}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span
                            style={{
                              backgroundColor: sectorColor.bg,
                              color: sectorColor.text,
                              border: `1px solid ${sectorColor.border}`,
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {company.sector}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#4B5563", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {company.description}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#4B5563", whiteSpace: "nowrap" }}>
                          {company.stage}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#4B5563", whiteSpace: "nowrap" }}>
                          {company.geo}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#4B5563", whiteSpace: "nowrap" }}>
                          {company.raised}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {company.status === "Written Up" ? (
                            <a
                              href={`mailto:searlachlan@gmail.com?subject=${encodeURIComponent(`Investment Memo Request: ${company.name}`)}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border}`,
                                padding: "2px 10px",
                                borderRadius: 4,
                                fontSize: 11,
                                whiteSpace: "nowrap",
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontWeight: 600,
                                cursor: "pointer",
                                textDecoration: "none",
                                display: "inline-block",
                                transition: "opacity 0.15s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                            >
                              <span style={{ marginRight: 4, fontSize: 10 }}>&#9993;</span>
                              {company.status}
                            </a>
                          ) : (
                            <span
                              style={{
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border}`,
                                padding: "2px 10px",
                                borderRadius: 4,
                                fontSize: 11,
                                whiteSpace: "nowrap",
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                fontWeight: 400,
                              }}
                            >
                              {company.status}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                display: "block",
                                width: company.founderAccess && company.status !== "Benchmark" ? 10 : 14,
                                height: company.founderAccess && company.status !== "Benchmark" ? 10 : 14,
                                borderRadius: "50%",
                                backgroundColor: company.status === "Benchmark" ? "#E5E7EB" : (company.founderAccess ? "#166534" : "#E5E7EB"),
                                flexShrink: 0,
                              }}
                            />
                            {company.founderAccess && company.status !== "Benchmark" && company.contactName && (
                              <a
                                href={company.contactLinkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  color: "#166534",
                                  fontSize: 12,
                                  fontWeight: 500,
                                  textDecoration: "none",
                                  fontFamily: "'IBM Plex Sans', sans-serif",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                              >
                                {company.contactName}
                              </a>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "10px 8px" }}>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: "#9CA3AF", display: "inline-flex", transition: "color 0.15s" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#4B5563")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                            >
                              <LinkIcon />
                            </a>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ backgroundColor: "#f8faf8", borderBottom: "1px solid #F3F4F6" }}>
                          <td colSpan={9} style={{ padding: "0 12px 14px 12px" }}>
                            <div
                              style={{
                                padding: "14px 18px",
                                backgroundColor: "#E7F3E9",
                                borderRadius: 8,
                                border: "1px solid #D4E8D8",
                              }}
                            >
                              <div style={{ display: "flex", gap: 24, marginBottom: (company.investors && company.investors !== "—") || company.thesis || company.status === "Written Up" ? 14 : 0, flexWrap: "wrap" }}>
                                {company.founded && (
                                  <div><span style={labelStyle}>Founded</span><span style={valueStyle}>{company.founded}</span></div>
                                )}
                                {company.stage && company.stage !== "—" && (
                                  <div><span style={labelStyle}>Stage</span><span style={valueStyle}>{company.stage}</span></div>
                                )}
                                {company.geo && company.geo !== "—" && (
                                  <div><span style={labelStyle}>Location</span><span style={valueStyle}>{company.geo}</span></div>
                                )}
                                {company.raised && company.raised !== "—" && (
                                  <div><span style={labelStyle}>Raised</span><span style={valueStyle}>{company.raised}</span></div>
                                )}
                              </div>

                              {company.investors && company.investors !== "—" && (
                                <div style={{ marginBottom: company.thesis || company.status === "Written Up" ? 12 : 0 }}>
                                  <div style={labelStyle}>Investors</div>
                                  <div style={{ color: "#4B5563", marginTop: 3, lineHeight: 1.5 }}>{company.investors}</div>
                                </div>
                              )}

                              {company.thesis && (
                                <div style={{ marginBottom: company.status === "Written Up" ? 12 : 0 }}>
                                  <div style={labelStyle}>Thesis</div>
                                  <div style={{ color: "#4B5563", marginTop: 3, lineHeight: 1.6, fontSize: 12 }}>{company.thesis}</div>
                                </div>
                              )}

                              {company.status === "Written Up" && (
                                <a
                                  href={`mailto:searlachlan@gmail.com?subject=${encodeURIComponent(`Investment Memo Request: ${company.name}`)}`}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{ color: "#71717a", fontSize: 13, textDecoration: "none", display: "inline-block", marginTop: 2 }}
                                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                                >
                                  Request Investment Memo &rarr;
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {filteredCompanies.map((company) => {
              const sectorColor = SECTOR_COLORS[company.sector] || SECTOR_COLORS["—"];
              const statusStyle = STATUS_STYLES[company.status] || STATUS_STYLES["Tracking"];
              const isExpanded = expandedId === company.id;

              return (
                <div
                  key={company.id}
                  onClick={() => setExpandedId(isExpanded ? null : company.id)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 10,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 600, color: "#1A1A1A", fontSize: 15 }}>{company.name}</span>
                        {isNew(company.dateAdded) && (
                          <span style={{
                            fontSize: 9,
                            fontWeight: 600,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            color: "#dc2626",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: 4,
                            padding: "1px 5px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            lineHeight: "16px",
                            whiteSpace: "nowrap",
                          }}>
                            New
                          </span>
                        )}
                      </span>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "#9CA3AF", display: "inline-flex" }}
                        >
                          <LinkIcon />
                        </a>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: company.status === "Benchmark" ? "#E5E7EB" : (company.founderAccess ? "#166534" : "#E5E7EB"),
                          flexShrink: 0,
                        }}
                      />
                      {company.founderAccess && company.status !== "Benchmark" && company.contactName && (
                        <a
                          href={company.contactLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: "#166534",
                            fontSize: 12,
                            fontWeight: 500,
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                        >
                          {company.contactName}
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span
                      style={{
                        backgroundColor: sectorColor.bg,
                        color: sectorColor.text,
                        border: `1px solid ${sectorColor.border}`,
                        padding: "1px 7px",
                        borderRadius: 4,
                        fontSize: 11,
                      }}
                    >
                      {company.sector}
                    </span>
                    {company.status === "Written Up" ? (
                      <a
                        href={`mailto:searlachlan@gmail.com?subject=${encodeURIComponent(`Investment Memo Request: ${company.name}`)}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                          padding: "1px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "none",
                          transition: "opacity 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <span style={{ marginRight: 4, fontSize: 10 }}>&#9993;</span>
                        {company.status}
                      </a>
                    ) : (
                      <span
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                          padding: "1px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {company.status}
                      </span>
                    )}
                  </div>

                  {company.description !== "—" && (
                    <div style={{ color: "#4B5563", fontSize: 13, lineHeight: 1.4, marginBottom: 6 }}>
                      {company.description}
                    </div>
                  )}

                  <div style={{ color: "#6B7280", fontSize: 12 }}>
                    {[company.stage, company.geo, company.raised]
                      .filter((v) => v && v !== "—")
                      .join(" \u00b7 ")}
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E2EDE4" }}>
                      <div
                        style={{
                          padding: "14px 18px",
                          backgroundColor: "#E7F3E9",
                          borderRadius: 8,
                          border: "1px solid #D4E8D8",
                        }}
                      >
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
                          {company.founded && (
                            <div><span style={labelStyle}>Founded</span><span style={valueStyle}>{company.founded}</span></div>
                          )}
                          {company.raised && company.raised !== "—" && (
                            <div><span style={labelStyle}>Raised</span><span style={valueStyle}>{company.raised}</span></div>
                          )}
                        </div>

                        {company.investors && company.investors !== "—" && (
                          <div style={{ marginBottom: 8 }}>
                            <div style={labelStyle}>Investors</div>
                            <div style={{ color: "#4B5563", marginTop: 2, fontSize: 12, lineHeight: 1.5 }}>{company.investors}</div>
                          </div>
                        )}

                        {company.thesis && (
                          <div style={{ marginBottom: company.status === "Written Up" ? 8 : 0 }}>
                            <div style={labelStyle}>Thesis</div>
                            <div style={{ color: "#4B5563", marginTop: 2, fontSize: 12, lineHeight: 1.5 }}>{company.thesis}</div>
                          </div>
                        )}

                        {company.status === "Written Up" && (
                          <a
                            href={`mailto:searlachlan@gmail.com?subject=${encodeURIComponent(`Investment Memo Request: ${company.name}`)}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: "#71717a", fontSize: 13, textDecoration: "none" }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                          >
                            Request Investment Memo &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredCompanies.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "#6B7280", fontSize: 13 }}>
              No companies found
            </div>
          )}

        </div>
      </div>

      {/* Footer — Eton blue */}
      <div style={{ backgroundColor: "#E7F3E9", padding: "24px", textAlign: "center" }}>
        <div style={{ color: "#6B7280", fontSize: 12, fontFamily: "'IBM Plex Sans', sans-serif" }}>
          The Searing List
        </div>
      </div>

      <style>{`
        .tabs-scroll::-webkit-scrollbar { display: none; }
        .mobile-cards { display: none; }
        @media (max-width: 767px) {
          .desktop-table { display: none !important; }
          .mobile-cards { display: block !important; }
        }
        @media (max-width: 639px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  color: "#6B7280",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginRight: 8,
  fontWeight: 500,
};

const valueStyle: React.CSSProperties = {
  color: "#1A1A1A",
  fontSize: 13,
};
