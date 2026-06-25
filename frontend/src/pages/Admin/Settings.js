import React, { useMemo, useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'

import AdminLayout from '../../components/AdminLayout'
import './Settings.css'

const nowIso = () => new Date().toISOString()

const Settings = () => {
  const { userInfo } = useSelector((state) => state.userLogin)

  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${userInfo?.token || ''}`,
      },
    }),
    [userInfo?.token],
  )

  const [running, setRunning] = useState(false)
  const [results, setResults] = useState([])

  // Redirect if not admin or not logged in
  if (!userInfo || !userInfo.isAdmin) {
    return <Redirect to="/login" />
  }


  const runChecks = async () => {
    if (running) return
    setRunning(true)
    setResults([])

    const checks = [
      {
        id: 'meta',
        label: 'Meta JSON',
        run: async () => axios.get('/meta.json'),
      },
      {
        id: 'products',
        label: 'List products',
        run: async () => axios.get('/api/products'),
      },
      {
        id: 'admin_stats',
        label: 'Admin statistics (auth)',
        run: async () => axios.get('/api/admin/statistics', authConfig),
      },
      {
        id: 'admin_orders',
        label: 'Admin orders (auth)',
        run: async () => axios.get('/api/orders', authConfig),
      },
    ]

    const next = []
    for (const check of checks) {
      const start = performance.now()
      try {
        const res = await check.run()
        const ms = Math.round(performance.now() - start)
        next.push({
          id: check.id,
          label: check.label,
          ok: true,
          ms,
          time: nowIso(),
          message: `OK (${res.status})`,
        })
      } catch (err) {
        const ms = Math.round(performance.now() - start)
        const status = err?.response?.status
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Request failed'
        next.push({
          id: check.id,
          label: check.label,
          ok: false,
          ms,
          time: nowIso(),
          message: status ? `${message} (${status})` : message,
        })
      }
      setResults([...next])
    }

    setRunning(false)
  }

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length

  return (
    <AdminLayout>
      <div className="admin-settings">
        <section className="settings-card">
          <div className="settings-card__head">
            <div>
              <h2 className="settings-title">UI Tests (Smoke Checks)</h2>
              <p className="settings-subtitle">
                Run basic checks to confirm the app and admin APIs are responding.
              </p>
            </div>
            <button
              className="settings-btn"
              type="button"
              onClick={runChecks}
              disabled={running}
            >
              {running ? 'Running…' : 'Run checks'}
            </button>
          </div>

          <div className="settings-summary">
            <div className="settings-pill settings-pill--ok">Passed: {passed}</div>
            <div className="settings-pill settings-pill--bad">Failed: {failed}</div>
          </div>

          {results.length === 0 ? (
            <div className="settings-empty">
              No checks run yet. Click <b>Run checks</b>.
            </div>
          ) : (
            <div className="settings-table" role="table" aria-label="UI test results">
              <div className="settings-row settings-row--head" role="row">
                <div role="columnheader">Check</div>
                <div role="columnheader">Status</div>
                <div role="columnheader">Time</div>
                <div role="columnheader">Latency</div>
                <div role="columnheader">Message</div>
              </div>
              {results.map((r) => (
                <div className="settings-row" role="row" key={r.id}>
                  <div role="cell">{r.label}</div>
                  <div role="cell">
                    <span className={r.ok ? 'status status--ok' : 'status status--bad'}>
                      {r.ok ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div role="cell" className="mono">
                    {r.time}
                  </div>
                  <div role="cell" className="mono">
                    {r.ms}ms
                  </div>
                  <div role="cell">{r.message}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

export default Settings

