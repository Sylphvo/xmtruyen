import React from 'react';
import Chart from 'react-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight, faEllipsisH, faDownload, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import {
  contactsChart,
  leadChart,
  tasksChart,
  trafficChart,
  revenueChart,
  retentionChart,
  earningChart,
  heatmapChart
} from '../constants/chartConfig';

export const Dashboard: React.FC = () => {
  return (
    <div className="container-fluid p-0">
      {/* Breadcrumb */}
      <div className="d-flex align-items-center mb-4 text-muted small">
        <FontAwesomeIcon icon={faHome} style={{ fontSize: '14px' }} className="me-2" />
        <span>Home</span>
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '14px' }} className="mx-2" />
        <span className="text-white">Dashboard</span>
      </div>

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-12 col-xl-5">
          <div className="row g-4">
            {/* Total Contacts */}
            <div className="col-sm-6">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="text-muted small">Total Contacts</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-muted cursor-pointer" />
                </div>
                <div className="card-body pt-2">
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="fw-bold mb-0 me-2 text-white">5,758</h3>
                    <span className="badge badge-soft text-success px-2 py-1" style={{fontSize: '10px'}}>+2.57%</span>
                  </div>
                  <div style={{ height: '60px' }}>
                    <Chart options={contactsChart.options} series={contactsChart.series} type="bar" height="100%" />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3 text-muted small">
                    <span>Vs last month: 1,195</span>
                    <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '14px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Analytics */}
            <div className="col-sm-6">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="text-muted small">Lead Analytics</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-muted cursor-pointer" />
                </div>
                <div className="card-body pt-2">
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="fw-bold mb-0 me-2 text-white">70</h3>
                    <span className="badge badge-soft text-danger px-2 py-1" style={{fontSize: '10px'}}>-2.57%</span>
                  </div>
                  <div style={{ height: '60px' }}>
                    <Chart options={leadChart.options} series={leadChart.series} type="line" height="100%" />
                  </div>
                  <div className="text-center mt-3 text-muted small">
                    <span>Compared to Last Month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Overview */}
            <div className="col-sm-6">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="text-muted small">Tasks Overview</h6>
                  <span className="text-muted small" style={{fontSize: '10px'}}>Tasks Done <span className="text-white">25</span></span>
                </div>
                <div className="card-body pt-2 d-flex align-items-center">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-primary rounded-circle me-2" style={{width: 8, height: 8}}></div>
                      <span className="text-muted small">Follow-ups</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="rounded-circle me-2" style={{width: 8, height: 8, backgroundColor: '#423eb3'}}></div>
                      <span className="text-muted small">In Progress</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle me-2" style={{width: 8, height: 8, backgroundColor: '#2a2880'}}></div>
                      <span className="text-muted small">Pending</span>
                    </div>
                  </div>
                  <div style={{ width: '80px', height: '80px' }}>
                    <Chart options={tasksChart.options} series={tasksChart.series} type="donut" height="100%" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Deals */}
            <div className="col-sm-6">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="text-muted small">Active Deals</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-muted cursor-pointer" />
                </div>
                <div className="card-body pt-2 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center">
                    <h3 className="fw-bold mb-0 me-2 text-white">1,249</h3>
                    <span className="badge badge-soft text-success px-2 py-1" style={{fontSize: '10px'}}>+2.57%</span>
                  </div>
                  <div className="mt-auto d-flex justify-content-between align-items-center text-muted small">
                    <span>Vs last month: 1,195</span>
                    <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '14px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="col-12">
              <div className="card">
                <div className="card-header border-0">
                  <h6 className="mb-0 text-white">Revenue</h6>
                  <div className="d-flex gap-2 rounded-pill p-1" style={{backgroundColor: '#1f2128'}}>
                    <button className="btn btn-sm btn-link text-muted text-decoration-none px-3">Today</button>
                    <button className="btn btn-sm btn-link text-muted text-decoration-none px-3">Week</button>
                    <button className="btn btn-sm btn-primary rounded-pill px-3" style={{backgroundColor: '#2a2b36', border: '1px solid rgba(255,255,255,0.1)'}}>Month</button>
                    <button className="btn btn-sm btn-icon border-0 ms-1" style={{height: '28px', width: '28px'}}><FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '14px' }}/></button>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div className="d-flex align-items-end mb-4">
                    <h2 className="fw-bold mb-0 me-2 text-white">$2,56,054.50</h2>
                    <span className="text-success small mb-1">+20% vs last month</span>
                  </div>
                  <div style={{ height: '250px' }}>
                    <Chart options={revenueChart.options} series={revenueChart.series} type="bar" height="100%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="col-12 col-xl-4">
          <div className="row g-4 flex-column h-100">
            {/* Traffic Sources */}
            <div className="col-12 flex-grow-1">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="mb-0 text-white">Traffic Sources</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-muted cursor-pointer" />
                </div>
                <div className="card-body">
                  <div style={{ height: '80px', marginBottom: '2rem' }}>
                    <Chart options={trafficChart.options} series={trafficChart.series} type="bar" height="100%" />
                  </div>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {[
                      { name: 'Organic Search', val: '41.50%', color: '#5955D1' },
                      { name: 'Direct Traffic', val: '27%', color: '#423eb3' },
                      { name: 'Referral Traffic', val: '18%', color: '#2a2880' },
                      { name: 'Social Media', val: '10.30%', color: '#1c1b5e' },
                      { name: 'Email Traffic', val: '3.20%', color: '#1c1b5e' }
                    ].map((item, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-center text-muted small">
                        <div className="d-flex align-items-center">
                          <div className="rounded-1 me-3" style={{width: 12, height: 12, backgroundColor: item.color}}></div>
                          <span>{item.name}</span>
                        </div>
                        <span className="text-white">{item.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top" style={{borderColor: 'rgba(255,255,255,0.05)'}}>
                    <span className="text-muted small">Annual report</span>
                    <button className="btn btn-sm btn-link text-primary text-decoration-none d-flex align-items-center px-0">
                      <FontAwesomeIcon icon={faDownload} style={{ fontSize: '14px' }} className="me-1" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Retention Rate */}
            <div className="col-12">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="mb-0 text-white">Retention Rate</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-muted cursor-pointer" />
                </div>
                <div className="card-body pt-2">
                  <div className="d-flex align-items-end mb-3">
                    <h2 className="fw-bold mb-0 me-2 text-white">92%</h2>
                    <span className="text-success small mb-1">+15% vs last month</span>
                  </div>
                  <div style={{ height: '220px' }}>
                    <Chart options={retentionChart.options} series={retentionChart.series} type="bar" height="100%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-12 col-xl-3">
          <div className="row g-4 flex-column h-100">
            {/* Total Earning */}
            <div className="col-12 flex-grow-1">
              <div className="card card-purple p-2">
                <div className="card-header">
                  <h6 className="mb-0 text-white">Total Earning</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-white cursor-pointer" />
                </div>
                <div className="card-body text-center d-flex flex-column align-items-center">
                  <div style={{ height: '180px', width: '100%', marginTop: '-20px' }}>
                    <Chart options={earningChart.options} series={earningChart.series} type="radialBar" height="100%" />
                  </div>
                  <div className="d-flex justify-content-between w-100 px-3 mb-4 mt-2">
                    <div className="text-start">
                      <div className="d-flex align-items-center mb-1">
                        <div className="bg-white rounded-sm me-2" style={{width: 8, height: 8}}></div>
                        <h5 className="fw-bold mb-0 text-white">$2.78m</h5>
                      </div>
                      <small className="text-white ms-3 d-block" style={{opacity: 0.7}}>245 Pickups</small>
                    </div>
                    <div className="text-end">
                      <div className="d-flex align-items-center mb-1">
                        <div className="rounded-sm me-2" style={{width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.5)'}}></div>
                        <h5 className="fw-bold mb-0 text-white">$65,823</h5>
                      </div>
                      <small className="text-white ms-3 d-block" style={{opacity: 0.7}}>120 Shipment</small>
                    </div>
                  </div>

                  <div className="w-100 text-start mt-auto">
                    <h6 className="mb-3 text-white">Orders Status</h6>
                    <div className="progress progress-dark rounded-pill mb-4" style={{height: '8px'}}>
                      <div className="progress-bar bg-white rounded-pill" style={{width: '70%'}}></div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {[
                        { label: 'Paid', val: '70%' },
                        { label: 'Cancelled', val: '25%' },
                        { label: 'Refunded', val: '5%' }
                      ].map((item, i) => (
                        <div key={i} className="d-flex justify-content-between align-items-center small">
                          <div className="d-flex align-items-center">
                            <div className="bg-white rounded-sm me-2" style={{width: 8, height: 8, opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.4}}></div>
                            <span className="text-white">{item.label}</span>
                          </div>
                          <span className="fw-bold text-white">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order By Time */}
            <div className="col-12">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h6 className="mb-0 text-white">Order By Time</h6>
                  <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: '16px' }} className="text-muted cursor-pointer" />
                </div>
                <div className="card-body">
                  <div style={{ height: '180px' }}>
                    <Chart options={heatmapChart.options} series={heatmapChart.series} type="heatmap" height="100%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
