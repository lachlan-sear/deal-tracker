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
}

const SECTOR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Healthcare: { bg: "#0a2e1a", text: "#34d399", border: "#166534" },
  LegalTech: { bg: "#1a1a2e", text: "#818cf8", border: "#3730a3" },
  Consumer: { bg: "#2e1a0a", text: "#fb923c", border: "#9a3412" },
  Gaming: { bg: "#2e0a2e", text: "#e879f9", border: "#86198f" },
  "Enterprise Software": { bg: "#0a1a2e", text: "#38bdf8", border: "#075985" },
  "AI Infrastructure": { bg: "#1a0a2e", text: "#a78bfa", border: "#5b21b6" },
  FinTech: { bg: "#0a2e2e", text: "#2dd4bf", border: "#115e59" },
  Cybersecurity: { bg: "#2e0a0a", text: "#f87171", border: "#991b1b" },
  "Defence & Security": { bg: "#1a1a0a", text: "#facc15", border: "#854d0e" },
  "Deep Tech": { bg: "#0a0a2e", text: "#60a5fa", border: "#1e40af" },
  "\u2014": { bg: "#1a1a1a", text: "#737373", border: "#404040" },
};

const TABS = [
  "All",
  "Written Up",
  "Healthcare",
  "LegalTech",
  "FinTech",
  "Enterprise Software",
  "AI Infrastructure",
  "Cybersecurity",
  "Defence & Security",
  "Deep Tech",
  "Consumer",
  "Gaming",
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Written Up": { bg: "#022c22", text: "#34d399", border: "#065f46" },
  "Deep Dive": { bg: "#1e1b4b", text: "#818cf8", border: "#3730a3" },
  Tracking: { bg: "#171717", text: "#737373", border: "#333" },
};

const STATUS_ORDER = ["Tracking", "Deep Dive", "Written Up"];

export default function DealTracker() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>(companiesData as Company[]);

  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    if (activeTab === "Written Up") {
      result = result.filter((c) => c.status === "Written Up");
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

    return result;
  }, [companies, activeTab, searchQuery]);

  const stats = useMemo(() => {
    let totalRaised = 0;
    companies.forEach((c) => {
      const match = c.raised.match(/([\d.]+)/);
      if (match) totalRaised += parseFloat(match[1]);
    });

    return {
      companies: companies.length,
      writeUps: companies.filter((c) => c.status === "Written Up").length,
      sectors: new Set(companies.map((c) => c.sector).filter((s) => s !== "\u2014")).size,
      founderAccess: companies.filter((c) => c.founderAccess).length,
      totalRaised: `$${Math.round(totalRaised)}M+`,
    };
  }, [companies]);

  const cycleStatus = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = STATUS_ORDER.indexOf(c.status);
        return { ...c, status: STATUS_ORDER[(idx + 1) % STATUS_ORDER.length] };
      })
    );
  };

  const getTabCount = (tab: string) => {
    if (tab === "All") return companies.length;
    if (tab === "Written Up") return companies.filter((c) => c.status === "Written Up").length;
    return companies.filter((c) => c.sector === tab).length;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#09090b",
        color: "#e4e4e7",
        fontFamily: "'DM Sans', sans-serif",
        padding: "24px 24px 48px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fafafa", margin: 0 }}>
            Deal Pipeline
          </h1>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies..."
            style={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 6,
              padding: "8px 14px",
              color: "#e4e4e7",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              outline: "none",
              width: 260,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3f3f46")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#27272a")}
          />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Companies", value: stats.companies },
            { label: "Write-ups", value: stats.writeUps },
            { label: "Sectors", value: stats.sectors },
            { label: "Founder Access", value: stats.founderAccess },
            { label: "Total Raised", value: stats.totalRaised },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 8,
                padding: "12px 20px",
                flex: "1 1 140px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#52525b",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#fafafa",
                  fontFamily: "'JetBrains Mono', monospace",
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
            marginBottom: 20,
            flexWrap: "wrap",
            borderBottom: "1px solid #1e1e24",
            paddingBottom: 12,
          }}
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
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: isActive ? "#27272a" : "transparent",
                  color: isActive ? "#fafafa" : "#71717a",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
                <span
                  style={{
                    color: isActive ? "#a1a1aa" : "#3f3f46",
                    fontSize: 11,
                    marginLeft: 5,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #1e1e24" }}>
                {[
                  "Company",
                  "Sector",
                  "Description",
                  "Stage",
                  "Geo",
                  "Raised",
                  "Status",
                  "Founder",
                  "Network",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      color: "#3f3f46",
                      fontSize: 10,
                      fontWeight: 500,
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
                const sectorColor = SECTOR_COLORS[company.sector] || SECTOR_COLORS["\u2014"];
                const statusStyle = STATUS_STYLES[company.status] || STATUS_STYLES["Tracking"];
                const isExpanded = expandedId === company.id;

                return (
                  <Fragment key={company.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : company.id)}
                      style={{
                        borderBottom: isExpanded ? "none" : "1px solid #131316",
                        cursor: "pointer",
                        backgroundColor: isExpanded ? "#0f0f12" : "transparent",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isExpanded)
                          e.currentTarget.style.backgroundColor = "#0f0f12";
                      }}
                      onMouseLeave={(e) => {
                        if (!isExpanded)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          fontWeight: 600,
                          color: "#fafafa",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {company.name}
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
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#71717a",
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {company.description}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#71717a",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {company.stage}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#71717a",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {company.geo}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#71717a",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {company.raised}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <button
                          onClick={(e) => cycleStatus(e, company.id)}
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                            padding: "2px 10px",
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {company.status}
                        </button>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span
                          title={company.founderAccess ? "Founder access" : "No founder access"}
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: company.founderAccess ? "#34d399" : "#27272a",
                            cursor: "default",
                          }}
                        />
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        <span
                          title={company.networkAccess ? "Network access" : "No network access"}
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: company.networkAccess ? "#60a5fa" : "#27272a",
                            cursor: "default",
                          }}
                        />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr
                        style={{
                          backgroundColor: "#0f0f12",
                          borderBottom: "1px solid #131316",
                        }}
                      >
                        <td colSpan={9} style={{ padding: "0 12px 14px 12px" }}>
                          <div
                            style={{
                              padding: "14px 18px",
                              backgroundColor: "#0a0a0d",
                              borderRadius: 8,
                              border: "1px solid #1e1e24",
                            }}
                          >
                            {/* Metadata row */}
                            <div
                              style={{
                                display: "flex",
                                gap: 24,
                                marginBottom:
                                  (company.investors && company.investors !== "\u2014") ||
                                  company.thesis ||
                                  company.url
                                    ? 14
                                    : 0,
                                flexWrap: "wrap",
                              }}
                            >
                              {company.founded && (
                                <div>
                                  <span style={labelStyle}>Founded</span>
                                  <span style={valueStyle}>{company.founded}</span>
                                </div>
                              )}
                              {company.stage && company.stage !== "\u2014" && (
                                <div>
                                  <span style={labelStyle}>Stage</span>
                                  <span style={valueStyle}>{company.stage}</span>
                                </div>
                              )}
                              {company.geo && company.geo !== "\u2014" && (
                                <div>
                                  <span style={labelStyle}>Location</span>
                                  <span style={valueStyle}>{company.geo}</span>
                                </div>
                              )}
                              {company.raised && company.raised !== "\u2014" && (
                                <div>
                                  <span style={labelStyle}>Raised</span>
                                  <span style={valueStyle}>{company.raised}</span>
                                </div>
                              )}
                            </div>

                            {/* Investors */}
                            {company.investors && company.investors !== "\u2014" && (
                              <div style={{ marginBottom: company.thesis || company.url ? 12 : 0 }}>
                                <div style={labelStyle}>Investors</div>
                                <div style={{ color: "#a1a1aa", marginTop: 3, lineHeight: 1.5 }}>
                                  {company.investors}
                                </div>
                              </div>
                            )}

                            {/* Thesis */}
                            {company.thesis && (
                              <div style={{ marginBottom: company.url ? 12 : 0 }}>
                                <div style={labelStyle}>Thesis</div>
                                <div
                                  style={{
                                    color: "#a1a1aa",
                                    marginTop: 3,
                                    lineHeight: 1.6,
                                    fontSize: 12,
                                  }}
                                >
                                  {company.thesis}
                                </div>
                              </div>
                            )}

                            {/* Write-up link */}
                            {company.url && (
                              <a
                                href={company.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  color: "#38bdf8",
                                  fontSize: 12,
                                  textDecoration: "none",
                                  display: "inline-block",
                                  marginTop: 2,
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.textDecoration = "underline")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.textDecoration = "none")
                                }
                              >
                                Read Write-Up &rarr;
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

        {/* Empty state */}
        {filteredCompanies.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 48,
              color: "#3f3f46",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
            }}
          >
            No companies found
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  color: "#52525b",
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginRight: 8,
};

const valueStyle: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: 13,
};
