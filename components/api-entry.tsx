import React from "react"

interface Param {
  name: string
  type: string
  default?: string
  description: string
  optional?: boolean
}

interface Method {
  name: string
  signature: string
  description: string
  params?: Param[]
  returns?: string
}

interface ApiEntryProps {
  name: string           // e.g. "torch_pharma.models.diffusion.EquivariantVariationalDiffusion"
  signature: string      // after "class ClassName(" — the args only
  kind?: "class" | "function" | "method"
  description: string
  params?: Param[]
  returns?: string
  methods?: Method[]
  example?: string
  note?: string
}

export function ApiEntry({
  name,
  signature,
  kind = "class",
  description,
  params,
  returns,
  methods,
  example,
  note,
}: ApiEntryProps) {
  const label = kind === "class" ? "class " : kind === "function" ? "" : ""
  // short name = last segment
  const shortName = name.split(".").pop() ?? name

  return (
    <div className="api-entry mb-10">
      {/* Signature bar */}
      <div className="api-signature">
        <span className="api-keyword">{label}</span>
        <span className="api-module">{name.slice(0, name.lastIndexOf(".") + 1)}</span>
        <span className="api-classname">{shortName}</span>
        <span className="api-paren">(</span>
        <span className="api-params-inline">{signature}</span>
        <span className="api-paren">)</span>
      </div>

      {/* Body */}
      <div className="api-body">
        <p className="mb-4">{description}</p>

        {note && (
          <div className="api-note mb-4">
            <strong>Note:</strong> {note}
          </div>
        )}

        {params && params.length > 0 && (
          <div className="mb-5">
            <p className="api-section-label">Parameters</p>
            <ul className="api-params-list">
              {params.map((p) => (
                <li key={p.name} className="api-param-item">
                  <span className="api-param-name">{p.name}</span>
                  {" "}
                  <span className="api-param-type">
                    ({p.type}{p.optional ? ", optional" : ""})
                  </span>
                  {" – "}
                  <span className="api-param-desc">
                    {p.description}
                    {p.default !== undefined && (
                      <> Default: <code>{p.default}</code>.</>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {returns && (
          <div className="mb-5">
            <p className="api-section-label">Return type</p>
            <p className="font-mono text-sm">{returns}</p>
          </div>
        )}

        {example && (
          <div className="mb-5">
            <p className="api-section-label">Example</p>
            <pre className="api-code-block"><code>{example}</code></pre>
          </div>
        )}

        {methods && methods.length > 0 && (
          <div className="mb-2">
            <p className="api-section-label">Methods</p>
            <div className="space-y-6">
              {methods.map((m) => (
                <div key={m.name} className="api-method">
                  <div className="api-method-signature font-mono text-sm">
                    <span className="api-classname">{m.name}</span>
                    <span className="api-paren">(</span>
                    <span className="api-params-inline">{m.signature}</span>
                    <span className="api-paren">)</span>
                  </div>
                  <div className="api-method-body">
                    <p className="mb-2 text-sm">{m.description}</p>
                    {m.params && m.params.length > 0 && (
                      <ul className="api-params-list text-sm">
                        {m.params.map((p) => (
                          <li key={p.name} className="api-param-item">
                            <span className="api-param-name">{p.name}</span>{" "}
                            <span className="api-param-type">({p.type}{p.optional ? ", optional" : ""})</span>
                            {" – "}
                            {p.description}
                            {p.default !== undefined && (
                              <> Default: <code>{p.default}</code>.</>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {m.returns && (
                      <p className="mt-2 text-sm">
                        <span className="api-section-label">Return type</span>{" "}
                        <span className="font-mono">{m.returns}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Small inline summary table used on index pages */
interface ApiTableRow {
  name: string
  href: string
  description: string
}
interface ApiTableProps {
  rows: ApiTableRow[]
}
export function ApiTable({ rows }: ApiTableProps) {
  return (
    <div className="api-table-wrapper mb-8">
      <table className="api-index-table w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="api-index-row">
              <td className="api-index-name">
                <a href={r.href} className="api-link font-mono">{r.name}</a>
              </td>
              <td className="api-index-desc">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
