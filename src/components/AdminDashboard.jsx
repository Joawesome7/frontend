import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logoSrc from "../assets/img/logo.png";

// ─── PDF generation hook ───────────────────────────────────────────────────
function useReportPDF() {
  const generatePDF = async (elementRef, filename) => {
    const element = elementRef.current;
    if (!element) return;

    // Temporarily show the element for capture
    const prevDisplay = element.style.display;
    element.style.display = "block";

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      pdf.save(filename);
    } finally {
      element.style.display = prevDisplay;
    }
  };

  return { generatePDF };
}

// ─── Shared report header ──────────────────────────────────────────────────
function ReportHeader({ subtitle, generatedAt }) {
  return (
    <div
      style={{
        borderBottom: "2px solid #0e7490",
        paddingBottom: "16px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "8px",
        }}
      >
        <img
          src={logoSrc}
          alt="Villa Rose Logo"
          style={{ width: "56px", height: "56px", objectFit: "contain" }}
          crossOrigin="anonymous"
        />
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#0e7490",
              letterSpacing: "0.01em",
            }}
          >
            Villa Rose Sea Breeze Resort
          </div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
            Purok 4, San Miguel, Baras, 4803 Catanduanes
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "8px",
        }}
      >
        <div style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
          {subtitle}
        </div>
        <div style={{ fontSize: "10px", color: "#94a3b8", textAlign: "right" }}>
          Generated: {generatedAt || format(new Date(), "MMM dd, yyyy hh:mm a")}
        </div>
      </div>
    </div>
  );
}

// ─── Summary box component ─────────────────────────────────────────────────
function SummaryBox({ label, value, accent }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: "8px",
        border: `1px solid ${accent || "#e2e8f0"}`,
        background: accent ? `${accent}10` : "#f8fafc",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "#64748b",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: accent || "#1e293b",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── REPORT TEMPLATE 1: Daily Ending Sales Report ─────────────────────────
function DailyReportTemplate({ data, date }) {
  if (!data) return null;
  const { bookings, summary } = data;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "12px",
        color: "#1e293b",
        background: "#ffffff",
        padding: "32px",
        width: "750px",
        boxSizing: "border-box",
      }}
    >
      <ReportHeader
        subtitle={`Daily Ending Sales Report — ${format(new Date(date + "T00:00:00"), "MMMM dd, yyyy")}`}
      />

      {/* Summary Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <SummaryBox label="Total Bookings" value={summary.totalBookings} />
        <SummaryBox
          label="Confirmed"
          value={summary.confirmedCount}
          accent="#16a34a"
        />
        <SummaryBox
          label="Pending"
          value={summary.pendingCount}
          accent="#d97706"
        />
        <SummaryBox
          label="Gross Revenue"
          value={`₱${summary.grossRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
        />
        <SummaryBox
          label="Total Discounts"
          value={`-₱${summary.totalDiscounts.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#7c3aed"
        />
        <SummaryBox
          label="Net Revenue"
          value={`₱${summary.netRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#0e7490"
        />
        <SummaryBox
          label="Total Collected"
          value={`₱${summary.totalCollected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#16a34a"
        />
        <SummaryBox
          label="Outstanding Balance"
          value={`₱${summary.totalOutstanding.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#dc2626"
        />
      </div>

      {/* Bookings Table */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "#64748b",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Booking Details
      </div>
      {bookings.length === 0 ? (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#94a3b8",
            border: "1px dashed #e2e8f0",
            borderRadius: "8px",
          }}
        >
          No bookings checked in on this date.
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "11px",
          }}
        >
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {[
                "Ref #",
                "Guest",
                "Room",
                "Check-out",
                "Guests",
                "Total",
                "Paid",
                "Balance",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 6px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => {
              const balance =
                parseFloat(b.total_amount || 0) -
                parseFloat(b.paid_amount || 0);
              return (
                <tr
                  key={b.id}
                  style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
                >
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      fontFamily: "monospace",
                      fontSize: "10px",
                      color: "#0e7490",
                    }}
                  >
                    {b.booking_reference}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: "500",
                    }}
                  >
                    {b.guest_name}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      textTransform: "capitalize",
                    }}
                  >
                    {b.room_type?.replace(/_/g, " ")}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {format(new Date(b.check_out + "T00:00:00"), "MMM dd")}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      textAlign: "center",
                    }}
                  >
                    {b.guests_count}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: "600",
                    }}
                  >
                    ₱
                    {parseFloat(b.total_amount || 0).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      color: "#16a34a",
                      fontWeight: "600",
                    }}
                  >
                    ₱
                    {parseFloat(b.paid_amount || 0).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                      color: balance > 0 ? "#dc2626" : "#16a34a",
                      fontWeight: "600",
                    }}
                  >
                    ₱
                    {balance.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    style={{
                      padding: "7px 6px",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "600",
                        background:
                          b.payment_status === "confirmed"
                            ? "#dcfce7"
                            : "#fef9c3",
                        color:
                          b.payment_status === "confirmed"
                            ? "#15803d"
                            : "#a16207",
                      }}
                    >
                      {b.payment_status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "#f1f5f9", fontWeight: "700" }}>
              <td
                colSpan={5}
                style={{
                  padding: "8px 6px",
                  borderTop: "2px solid #e2e8f0",
                  color: "#475569",
                }}
              >
                TOTALS
              </td>
              <td
                style={{
                  padding: "8px 6px",
                  borderTop: "2px solid #e2e8f0",
                  color: "#0e7490",
                }}
              >
                ₱
                {summary.netRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{
                  padding: "8px 6px",
                  borderTop: "2px solid #e2e8f0",
                  color: "#16a34a",
                }}
              >
                ₱
                {summary.totalCollected.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{
                  padding: "8px 6px",
                  borderTop: "2px solid #e2e8f0",
                  color: "#dc2626",
                }}
              >
                ₱
                {summary.totalOutstanding.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{ padding: "8px 6px", borderTop: "2px solid #e2e8f0" }}
              />
            </tr>
          </tfoot>
        </table>
      )}

      <div
        style={{
          marginTop: "32px",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "12px",
          fontSize: "10px",
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Villa Rose Sea Breeze Resort · Official Use Only · This report is
        system-generated
      </div>
    </div>
  );
}

// ─── REPORT TEMPLATE 2: Monthly Sales Summary ─────────────────────────────
function MonthlyReportTemplate({ data, month, year }) {
  if (!data) return null;
  const { summary, roomBreakdown, bookings } = data;
  const monthLabel = format(new Date(year, month - 1, 1), "MMMM yyyy");

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "12px",
        color: "#1e293b",
        background: "#ffffff",
        padding: "32px",
        width: "750px",
        boxSizing: "border-box",
      }}
    >
      <ReportHeader subtitle={`Monthly Sales Summary — ${monthLabel}`} />

      {/* Monthly Summary Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <SummaryBox label="Total Bookings" value={summary.totalBookings} />
        <SummaryBox
          label="Confirmed"
          value={summary.confirmedCount}
          accent="#16a34a"
        />
        <SummaryBox
          label="Pending"
          value={summary.pendingCount}
          accent="#d97706"
        />
        <SummaryBox
          label="Gross Revenue"
          value={`₱${summary.grossRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
        />
        <SummaryBox
          label="Total Discounts Given"
          value={`-₱${summary.totalDiscounts.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#7c3aed"
        />
        <SummaryBox
          label="Net Revenue"
          value={`₱${summary.netRevenue.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#0e7490"
        />
        <SummaryBox
          label="Total Collected"
          value={`₱${summary.totalCollected.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#16a34a"
        />
        <SummaryBox
          label="Outstanding Balance"
          value={`₱${summary.totalOutstanding.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
          accent="#dc2626"
        />
        <SummaryBox
          label="Discounted Bookings"
          value={`${summary.discountedBookingsCount} bookings`}
          accent="#7c3aed"
        />
      </div>

      {/* Room Type Breakdown */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "#64748b",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Performance by Room Type
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "11px",
          marginBottom: "24px",
        }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            {[
              "Room Type",
              "Bookings",
              "Gross",
              "Discounts",
              "Net",
              "Collected",
              "Outstanding",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 6px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#475569",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roomBreakdown.map((r, i) => (
            <tr
              key={r.roomType}
              style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
            >
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {r.roomType?.replace(/_/g, " ")}
              </td>
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                  textAlign: "center",
                }}
              >
                {r.totalBookings}
              </td>
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                ₱
                {r.grossRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                  color: "#7c3aed",
                }}
              >
                ₱
                {r.totalDiscounts.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                  fontWeight: "600",
                  color: "#0e7490",
                }}
              >
                ₱
                {r.netRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                  color: "#16a34a",
                  fontWeight: "600",
                }}
              >
                ₱
                {r.totalCollected.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                style={{
                  padding: "7px 6px",
                  borderBottom: "1px solid #f1f5f9",
                  color: r.totalOutstanding > 0 ? "#dc2626" : "#16a34a",
                  fontWeight: "600",
                }}
              >
                ₱
                {r.totalOutstanding.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* All bookings this month */}
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          color: "#64748b",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        All Bookings — {monthLabel}
      </div>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}
      >
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            {[
              "Ref #",
              "Guest",
              "Room",
              "Check-in",
              "Check-out",
              "Total",
              "Paid",
              "Balance",
              "Status",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "7px 5px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#475569",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => {
            const balance =
              parseFloat(b.total_amount || 0) - parseFloat(b.paid_amount || 0);
            return (
              <tr
                key={b.id}
                style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
              >
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                    fontFamily: "monospace",
                    fontSize: "9px",
                    color: "#0e7490",
                  }}
                >
                  {b.booking_reference}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: "500",
                  }}
                >
                  {b.guest_name}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                    textTransform: "capitalize",
                  }}
                >
                  {b.room_type?.replace(/_/g, " ")}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {format(new Date(b.check_in + "T00:00:00"), "MMM dd")}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {format(new Date(b.check_out + "T00:00:00"), "MMM dd")}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: "600",
                  }}
                >
                  ₱
                  {parseFloat(b.total_amount || 0).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                    color: "#16a34a",
                  }}
                >
                  ₱
                  {parseFloat(b.paid_amount || 0).toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                    color: balance > 0 ? "#dc2626" : "#16a34a",
                  }}
                >
                  ₱
                  {balance.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td
                  style={{
                    padding: "6px 5px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "9px",
                      fontWeight: "600",
                      background:
                        b.payment_status === "confirmed"
                          ? "#dcfce7"
                          : "#fef9c3",
                      color:
                        b.payment_status === "confirmed"
                          ? "#15803d"
                          : "#a16207",
                    }}
                  >
                    {b.payment_status?.toUpperCase()}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "32px",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "12px",
          fontSize: "10px",
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Villa Rose Sea Breeze Resort · Official Use Only · This report is
        system-generated
      </div>
    </div>
  );
}

// ─── REPORT TEMPLATE 3: Individual Booking Receipt ────────────────────────
function BookingReceiptTemplate({ booking }) {
  if (!booking) return null;
  const balance =
    parseFloat(booking.total_amount || 0) -
    parseFloat(booking.paid_amount || 0);
  const isFullyPaid = balance <= 0;
  const hasDiscount = parseFloat(booking.discount_amount || 0) > 0;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "12px",
        color: "#1e293b",
        background: "#ffffff",
        padding: "32px",
        width: "600px",
        boxSizing: "border-box",
      }}
    >
      <ReportHeader subtitle="Booking Receipt" />

      {/* Status banner */}
      <div
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          background:
            booking.payment_status === "confirmed" ? "#dcfce7" : "#fef9c3",
          border: `1px solid ${booking.payment_status === "confirmed" ? "#86efac" : "#fde68a"}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontWeight: "700",
            fontSize: "13px",
            color:
              booking.payment_status === "confirmed" ? "#15803d" : "#a16207",
          }}
        >
          {booking.payment_status === "confirmed"
            ? "✓ CONFIRMED"
            : "⏳ PENDING CONFIRMATION"}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: "600",
            fontSize: "13px",
            color: "#1e293b",
          }}
        >
          {booking.booking_reference}
        </span>
      </div>

      {/* Two-column detail section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
              fontWeight: "600",
            }}
          >
            Guest Information
          </div>
          <ReceiptRow label="Name" value={booking.guest_name} />
          <ReceiptRow label="Email" value={booking.guest_email} />
          <ReceiptRow label="Phone" value={booking.guest_phone} />
          <ReceiptRow
            label="Number of Guests"
            value={`${booking.guests_count} pax`}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
              fontWeight: "600",
            }}
          >
            Booking Details
          </div>
          <ReceiptRow
            label="Room Type"
            value={booking.room_type?.replace(/_/g, " ")}
            capitalize
          />
          <ReceiptRow
            label="Check-in"
            value={format(
              new Date(booking.check_in + "T00:00:00"),
              "MMMM dd, yyyy",
            )}
          />
          <ReceiptRow
            label="Check-out"
            value={format(
              new Date(booking.check_out + "T00:00:00"),
              "MMMM dd, yyyy",
            )}
          />
          {booking.confirmed_at && (
            <ReceiptRow
              label="Confirmed On"
              value={format(
                new Date(booking.confirmed_at),
                "MMM dd, yyyy hh:mm a",
              )}
            />
          )}
          <ReceiptRow
            label="Booked On"
            value={format(new Date(booking.created_at), "MMM dd, yyyy")}
          />
        </div>
      </div>

      {/* Special requests */}
      {booking.special_requests && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: "600",
              marginBottom: "6px",
            }}
          >
            Special Requests
          </div>
          <div style={{ color: "#475569" }}>{booking.special_requests}</div>
        </div>
      )}

      {/* Payment breakdown */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            background: "#f1f5f9",
            fontSize: "10px",
            fontWeight: "600",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Payment Breakdown
        </div>
        <div style={{ padding: "14px" }}>
          {hasDiscount && (
            <>
              <PaymentRow
                label="Original Price"
                value={`₱${parseFloat(booking.original_amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
              />
              <PaymentRow
                label="Discount Applied"
                value={`-₱${parseFloat(booking.discount_amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                valueColor="#7c3aed"
              />
              <div
                style={{ borderTop: "1px dashed #e2e8f0", margin: "10px 0" }}
              />
            </>
          )}
          <PaymentRow
            label="Total Amount"
            value={`₱${parseFloat(booking.total_amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
            bold
          />
          <PaymentRow
            label={`Amount Paid ${booking.paid_amount < booking.total_amount ? "(Deposit)" : "(Full)"}`}
            value={`₱${parseFloat(booking.paid_amount || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
            valueColor="#16a34a"
            bold
          />
          <div style={{ borderTop: "2px solid #e2e8f0", margin: "10px 0" }} />
          <PaymentRow
            label="Remaining Balance"
            value={`₱${balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
            valueColor={isFullyPaid ? "#16a34a" : "#dc2626"}
            bold
          />
        </div>
      </div>

      {/* Balance note */}
      {!isFullyPaid && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            fontSize: "11px",
            color: "#9a3412",
            marginBottom: "20px",
          }}
        >
          ⚠️ A remaining balance of{" "}
          <strong>
            ₱{balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </strong>{" "}
          is due upon check-in.
        </div>
      )}

      <div
        style={{
          marginTop: "32px",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "12px",
          fontSize: "10px",
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Villa Rose Sea Breeze Resort · Official Use Only · This receipt is
        system-generated
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, capitalize }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "6px",
        gap: "8px",
      }}
    >
      <span style={{ color: "#64748b", fontSize: "11px", flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{
          fontWeight: "500",
          fontSize: "11px",
          textAlign: "right",
          textTransform: capitalize ? "capitalize" : "none",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PaymentRow({ label, value, valueColor, bold }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "8px",
      }}
    >
      <span
        style={{
          color: "#475569",
          fontSize: "12px",
          fontWeight: bold ? "600" : "400",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: valueColor || "#1e293b",
          fontWeight: bold ? "700" : "500",
          fontSize: "12px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Reports Tab Component ─────────────────────────────────────────────────
function ReportsTab({ adminToken, API_URL }) {
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dailyRef = useRef(null);
  const monthlyRef = useRef(null);
  const { generatePDF } = useReportPDF();

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      let url;
      if (reportType === "daily") {
        url = `${API_URL}/reports/daily?date=${selectedDate}`;
      } else {
        url = `${API_URL}/reports/monthly?month=${selectedMonth}&year=${selectedYear}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch report");
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (reportType === "daily") {
      await generatePDF(dailyRef, `VillaRose-Daily-Report-${selectedDate}.pdf`);
    } else {
      const monthName = format(
        new Date(selectedYear, selectedMonth - 1, 1),
        "MMMM-yyyy",
      );
      await generatePDF(
        monthlyRef,
        `VillaRose-Monthly-Report-${monthName}.pdf`,
      );
    }
  };

  const years = [];
  for (let y = new Date().getFullYear(); y >= 2024; y--) years.push(y);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div>
      {/* Report Type Toggle */}
      <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <button
            onClick={() => {
              setReportType("daily");
              setReportData(null);
            }}
            className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all ${
              reportType === "daily"
                ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            📅 Daily Ending Report
          </button>
          <button
            onClick={() => {
              setReportType("monthly");
              setReportData(null);
            }}
            className={`flex-1 px-5 py-3 rounded-xl font-semibold transition-all ${
              reportType === "monthly"
                ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            📊 Monthly Summary
          </button>
        </div>

        {/* Filters */}
        {reportType === "daily" ? (
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-white">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
              />
            </div>
            <button
              onClick={fetchReport}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Generate"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-white">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
              >
                {months.map((m, i) => (
                  <option key={m} value={i + 1} className="bg-slate-800">
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-white">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-slate-800">
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchReport}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Generate"}
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100">
          {error}
        </div>
      )}

      {/* Preview + Download */}
      {reportData && (
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {reportType === "daily"
                  ? `Daily Report — ${format(new Date(selectedDate + "T00:00:00"), "MMMM dd, yyyy")}`
                  : `Monthly Report — ${months[selectedMonth - 1]} ${selectedYear}`}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {reportData.summary.totalBookings} booking(s) · Net revenue ₱
                {reportData.summary.netRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
            >
              ⬇ Download PDF
            </button>
          </div>

          {/* Summary cards visible in dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total Bookings",
                value: reportData.summary.totalBookings,
                color: "text-white",
              },
              {
                label: "Net Revenue",
                value: `₱${reportData.summary.netRevenue.toLocaleString("en-PH")}`,
                color: "text-cyan-400",
              },
              {
                label: "Collected",
                value: `₱${reportData.summary.totalCollected.toLocaleString("en-PH")}`,
                color: "text-green-400",
              },
              {
                label: "Outstanding",
                value: `₱${reportData.summary.totalOutstanding.toLocaleString("en-PH")}`,
                color: "text-red-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden PDF templates */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={dailyRef} style={{ display: "none" }}>
          {reportType === "daily" && reportData && (
            <DailyReportTemplate data={reportData} date={selectedDate} />
          )}
        </div>
        <div ref={monthlyRef} style={{ display: "none" }}>
          {reportType === "monthly" && reportData && (
            <MonthlyReportTemplate
              data={reportData}
              month={selectedMonth}
              year={selectedYear}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// const AdminDashboard = ({ onClose }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [adminToken, setAdminToken] = useState("");
//   const [activeTab, setActiveTab] = useState("rooms");
//   const [rooms, setRooms] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editingRoom, setEditingRoom] = useState(null);
//   const [formData, setFormData] = useState({
//     key: "",
//     title: "",
//     description: "",
//     price: "",
//     images: [""],
//     amenities: [""],
//   });
//   const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

//   const showNotification = (message, type = "success") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (token) {
//       setAdminToken(token);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const fetchRooms = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/rooms`);
//       const data = await response.json();
//       if (response.ok) {
//         setRooms(data.rooms);
//       } else {
//         showNotification("Failed to fetch rooms", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching rooms:", error);
//       showNotification("Failed to connect to server", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchBookings = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/bookings`, {
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setBookings(data.bookings);
//       } else {
//         showNotification("Failed to fetch bookings", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       showNotification("Failed to connect to server", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       if (activeTab === "rooms") {
//         fetchRooms();
//       } else if (activeTab === "payments") {
//         fetchBookings();
//       }
//     }
//   }, [isAuthenticated, activeTab, adminToken]);

//   // Update the handleConfirmPayment function to accept paidAmount
//   const handleConfirmPayment = async (bookingId, paidAmount) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${API_URL}/bookings/${bookingId}/confirm-payment`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${adminToken}`,
//           },
//           body: JSON.stringify({ paidAmount }), // Send the paid amount
//         },
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to confirm payment");
//       }

//       alert(
//         `✅ ${data.message}\n\n` +
//           `Payment Type: ${data.paymentType === "full" ? "Full Payment" : "Deposit"}\n` +
//           `Amount Paid: ₱${data.paidAmount.toLocaleString()}\n` +
//           `Balance: ₱${data.balanceAmount.toLocaleString()}`,
//       );

//       // Refresh bookings
//       fetchBookings();
//     } catch (error) {
//       console.error("Error confirming payment:", error);
//       alert(`❌ Error: ${error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleArrayChange = (field, index, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].map((item, i) => (i === index ? value : item)),
//     }));
//   };

//   const addArrayItem = (field) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: [...prev[field], ""],
//     }));
//   };

//   const removeArrayItem = (field, index) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index),
//     }));
//   };

//   const resetForm = () => {
//     setFormData({
//       key: "",
//       title: "",
//       description: "",
//       price: "",
//       images: [""],
//       amenities: [""],
//     });
//     setEditingRoom(null);
//     setShowForm(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const cleanedData = {
//       ...formData,
//       images: formData.images.filter((img) => img.trim() !== ""),
//       amenities: formData.amenities.filter((am) => am.trim() !== ""),
//     };
//     try {
//       const url = editingRoom
//         ? `${API_URL}/rooms/${editingRoom.id}`
//         : `${API_URL}/rooms`;
//       const method = editingRoom ? "PUT" : "POST";
//       const response = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${adminToken}`,
//         },
//         body: JSON.stringify(cleanedData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         showNotification(
//           editingRoom
//             ? "Room updated successfully!"
//             : "Room created successfully!",
//           "success",
//         );
//         resetForm();
//         fetchRooms();
//       } else {
//         showNotification(
//           data.error || data.errors?.[0]?.msg || "Failed to save room",
//           "error",
//         );
//       }
//     } catch (error) {
//       console.error("Error saving room:", error);
//       showNotification("Failed to connect to server", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (room) => {
//     setEditingRoom(room);
//     setFormData({
//       key: room.key,
//       title: room.title,
//       description: room.description,
//       price: room.price,
//       images: Array.isArray(room.images)
//         ? room.images
//         : JSON.parse(room.images || "[]"),
//       amenities: Array.isArray(room.amenities)
//         ? room.amenities
//         : JSON.parse(room.amenities || "[]"),
//     });
//     setShowForm(true);
//   };

//   const handleDelete = async (roomId) => {
//     if (!window.confirm("Are you sure you want to delete this room?")) return;
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/rooms/${roomId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${adminToken}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         showNotification("Room deleted successfully!", "success");
//         fetchRooms();
//       } else {
//         showNotification(data.error || "Failed to delete room", "error");
//       }
//     } catch (error) {
//       console.error("Error deleting room:", error);
//       showNotification("Failed to connect to server", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     setIsAuthenticated(false);
//     setAdminToken("");
//     onClose();
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
//         <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
//           <h2 className="text-3xl font-serif font-semibold mb-6 text-center text-white">
//             Not Authenticated
//           </h2>
//           <p className="text-center text-slate-300 mb-6">
//             Please log in via the footer to access the admin dashboard.
//           </p>
//           <button
//             onClick={onClose}
//             className="w-full px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const pendingBookings = bookings.filter(
//     (b) => b.payment_status === "pending",
//   );
//   const confirmedBookings = bookings.filter(
//     (b) => b.payment_status === "confirmed",
//   );

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/95 backdrop-blur-sm modal-scroll">
//       <div className="min-h-screen p-5">
//         <div className="max-w-6xl mx-auto">
//           {/* Header & Navigation */}
//           <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
//             <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
//               <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-white text-center sm:text-left">
//                 Admin Dashboard
//               </h1>
//               <div className="flex gap-3 w-full sm:w-auto sm:justify-end">
//                 <button
//                   onClick={handleLogout}
//                   className="w-full sm:w-auto px-5 py-3 rounded-full border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-100"
//                 >
//                   Logout
//                 </button>
//                 {/* <button
//                   onClick={onClose}
//                   className="px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
//                 >
//                   Close
//                 </button> */}
//               </div>
//             </div>
//             {/* Tabs */}
//             <div className="flex flex-col sm:flex-row gap-2">
//               <button
//                 onClick={() => {
//                   setActiveTab("rooms");
//                   setShowForm(false);
//                 }}
//                 className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all ${
//                   activeTab === "rooms"
//                     ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
//                     : "bg-white/5 hover:bg-white/10 text-white"
//                 }`}
//               >
//                 🏠 Rooms Management
//               </button>
//               <button
//                 onClick={() => {
//                   setActiveTab("payments");
//                   setShowForm(false);
//                 }}
//                 className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center sm:justify-start ${
//                   activeTab === "payments"
//                     ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
//                     : "bg-white/5 hover:bg-white/10 text-white"
//                 }`}
//               >
//                 💰 Payment Confirmations
//                 {pendingBookings.length > 0 && (
//                   <span className="ml-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs">
//                     {pendingBookings.length}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//           {notification && (
//             <div
//               className={`mb-6 p-4 rounded-xl ${
//                 notification.type === "success"
//                   ? "bg-green-500/20 border border-green-500/50 text-green-100"
//                   : "bg-red-500/20 border border-red-500/50 text-red-100"
//               }`}
//             >
//               {notification.message}
//             </div>
//           )}
//           {activeTab === "rooms" && (
//             <>
//               {!showForm && (
//                 <div className="mb-6">
//                   <button
//                     onClick={() => setShowForm(true)}
//                     className="w-full sm:w-auto px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
//                   >
//                     + Add New Room
//                   </button>
//                 </div>
//               )}
//               {showForm && (
//                 <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
//                   <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 text-white">
//                     {editingRoom ? "Edit Room" : "Add New Room"}
//                   </h2>
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold mb-2 text-white">
//                           Room Key
//                         </label>
//                         <input
//                           type="text"
//                           name="key"
//                           value={formData.key}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
//                           placeholder="e.g., couple"
//                           required
//                           disabled={editingRoom !== null}
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-semibold mb-2 text-white">
//                           Room Title
//                         </label>
//                         <input
//                           type="text"
//                           name="title"
//                           value={formData.title}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
//                           placeholder="e.g., Couple Room"
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold mb-2 text-white">
//                         Description
//                       </label>
//                       <textarea
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
//                         rows="3"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold mb-2 text-white">
//                         Price
//                       </label>
//                       <input
//                         type="text"
//                         name="price"
//                         value={formData.price}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
//                         placeholder="e.g., ₱2,500/night"
//                         required
//                       />
//                     </div>
//                     {/* Dynamic Image URLs */}
//                     <div>
//                       <label className="block text-sm font-semibold mb-2 text-white">
//                         Image URLs
//                       </label>
//                       {formData.images.map((image, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-col sm:flex-row gap-2 mb-2"
//                         >
//                           <input
//                             type="url"
//                             value={image}
//                             onChange={(e) =>
//                               handleArrayChange("images", index, e.target.value)
//                             }
//                             className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
//                             placeholder="https://example.com/image.jpg"
//                           />
//                           {formData.images.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeArrayItem("images", index)}
//                               className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={() => addArrayItem("images")}
//                         className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
//                       >
//                         + Add Image
//                       </button>
//                     </div>
//                     {/* Dynamic Amenities */}
//                     <div>
//                       <label className="block text-sm font-semibold mb-2 text-white">
//                         Amenities
//                       </label>
//                       {formData.amenities.map((amenity, index) => (
//                         <div
//                           key={index}
//                           className="flex flex-col sm:flex-row gap-2 mb-2"
//                         >
//                           <input
//                             type="text"
//                             value={amenity}
//                             onChange={(e) =>
//                               handleArrayChange(
//                                 "amenities",
//                                 index,
//                                 e.target.value,
//                               )
//                             }
//                             className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
//                             placeholder="e.g., WiFi"
//                           />
//                           {formData.amenities.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 removeArrayItem("amenities", index)
//                               }
//                               className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={() => addArrayItem("amenities")}
//                         className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
//                       >
//                         + Add Amenity
//                       </button>
//                     </div>
//                     {/* Form Action Buttons */}
//                     <div className="flex gap-3 pt-4">
//                       <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full sm:flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50"
//                       >
//                         {isLoading
//                           ? "Saving..."
//                           : editingRoom
//                             ? "Update Room"
//                             : "Create Room"}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="w-full sm:w-auto px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               )}
//               {/* Room Cards List */}
//               <div className="space-y-4">
//                 {isLoading && rooms.length === 0 ? (
//                   <div className="text-center py-12">
//                     <p className="text-slate-400">Loading rooms...</p>
//                   </div>
//                 ) : rooms.length === 0 ? (
//                   <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
//                     <p className="text-slate-400">
//                       No rooms found. Add your first room!
//                     </p>
//                   </div>
//                 ) : (
//                   rooms.map((room) => (
//                     <div
//                       key={room.id}
//                       className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-xl hover:-translate-y-1 transition-transform"
//                     >
//                       <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
//                         <div className="flex-1 w-full">
//                           <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
//                             {room.title}
//                           </h3>
//                           <p className="text-slate-300 mb-3 text-sm sm:text-base">
//                             {room.description}
//                           </p>
//                           <div className="flex flex-wrap gap-2 mb-3">
//                             {(Array.isArray(room.amenities)
//                               ? room.amenities
//                               : JSON.parse(room.amenities || "[]")
//                             ).map((amenity, idx) => (
//                               <span
//                                 key={idx}
//                                 className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-sx sm:text-sm"
//                               >
//                                 {amenity}
//                               </span>
//                             ))}
//                           </div>
//                           <p className="text-lg font-semibold text-cyan-400">
//                             {room.price}
//                           </p>
//                           <p className="text-sm text-slate-400 mt-2 break-all">
//                             Key:{" "}
//                             <code className="bg-white/5 px-2 py-1 rounded">
//                               {room.key}
//                             </code>
//                           </p>
//                         </div>
//                         <div className="flex w-full sm:w-auto gap-2 sm:ml-4 mt-2 sm:mt-0">
//                           <button
//                             onClick={() => handleEdit(room)}
//                             className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-100 hover:bg-blue-500/30 transition-colors"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(room.id)}
//                             className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </>
//           )}
//           {activeTab === "payments" && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 text-white">
//                   ⏳ Pending Payments ({pendingBookings.length})
//                 </h2>

//                 {pendingBookings.length === 0 ? (
//                   <div className="text-center py-12">
//                     <p>No pending payments</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingBookings.map((booking) => (
//                       <PendingPaymentCard
//                         key={booking.id}
//                         booking={booking}
//                         onConfirmPayment={handleConfirmPayment}
//                         isLoading={isLoading}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 text-white">
//                   ✅ Confirmed Bookings ({confirmedBookings.length})
//                 </h2>
//                 {confirmedBookings.length === 0 ? (
//                   <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
//                     <p className="text-slate-400">No confirmed bookings yet</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {confirmedBookings.map((booking) => (
//                       <div
//                         key={booking.id}
//                         className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 backdrop-blur-lg shadow-xl"
//                       >
//                         <div className="flex flex-col sm:flex-row items-start justify-between">
//                           <div className="flex-1 w-full">
//                             <div className="flex flex-wrap items-center gap-3 mb-4">
//                               <h3 className="text-lg sm:text-xl font-semibold text-white">
//                                 {booking.guest_name}
//                               </h3>
//                               <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-100 text-sm font-semibold">
//                                 CONFIRMED
//                               </span>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <p className="text-sm text-slate-400">
//                                   Room Type
//                                 </p>
//                                 <p className="text-slate-200 capitalize">
//                                   {booking.room_type}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-slate-400">
//                                   Check-in → Check-out
//                                 </p>
//                                 <p className="text-slate-200">
//                                   {new Date(
//                                     booking.check_in,
//                                   ).toLocaleDateString()}{" "}
//                                   →{" "}
//                                   {new Date(
//                                     booking.check_out,
//                                   ).toLocaleDateString()}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-slate-400">
//                                   Total Amount
//                                 </p>
//                                 <p className="text-lg font-semibold text-cyan-400">
//                                   ₱{booking.total_amount?.toLocaleString()}
//                                 </p>
//                               </div>
//                               <div>
//                                 <p className="text-sm text-slate-400">
//                                   Booking Reference
//                                 </p>
//                                 <code className="text-sm font-mono bg-white/5 px-2 py-1 rounded text-white">
//                                   {booking.booking_reference}
//                                 </code>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// ─── Main AdminDashboard ───────────────────────────────────────────────────

const AdminDashboard = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    key: "",
    title: "",
    description: "",
    price: "",
    images: [""],
    amenities: [""],
  });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/rooms`);
      const data = await response.json();
      if (response.ok) {
        setRooms(data.rooms);
      } else {
        showNotification("Failed to fetch rooms", "error");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        setBookings(data.bookings);
      } else {
        showNotification("Failed to fetch bookings", "error");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "rooms") fetchRooms();
      else if (activeTab === "payments") fetchBookings();
    }
  }, [isAuthenticated, activeTab, adminToken]);

  const handleConfirmPayment = async (bookingId, paidAmount) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/confirm-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ paidAmount }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to confirm payment");
      alert(
        `✅ ${data.message}\n\n` +
          `Payment Type: ${data.paymentType === "full" ? "Full Payment" : "Deposit"}\n` +
          `Amount Paid: ₱${data.paidAmount.toLocaleString()}\n` +
          `Balance: ₱${data.balanceAmount.toLocaleString()}`,
      );
      fetchBookings();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      key: "",
      title: "",
      description: "",
      price: "",
      images: [""],
      amenities: [""],
    });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const cleanedData = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ""),
      amenities: formData.amenities.filter((am) => am.trim() !== ""),
    };
    try {
      const url = editingRoom
        ? `${API_URL}/rooms/${editingRoom.id}`
        : `${API_URL}/rooms`;
      const method = editingRoom ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(cleanedData),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(
          editingRoom
            ? "Room updated successfully!"
            : "Room created successfully!",
          "success",
        );
        resetForm();
        fetchRooms();
      } else {
        showNotification(
          data.error || data.errors?.[0]?.msg || "Failed to save room",
          "error",
        );
      }
    } catch (error) {
      console.error("Error saving room:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      key: room.key,
      title: room.title,
      description: room.description,
      price: room.price,
      images: Array.isArray(room.images)
        ? room.images
        : JSON.parse(room.images || "[]"),
      amenities: Array.isArray(room.amenities)
        ? room.amenities
        : JSON.parse(room.amenities || "[]"),
    });
    setShowForm(true);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        showNotification("Room deleted successfully!", "success");
        fetchRooms();
      } else {
        showNotification(data.error || "Failed to delete room", "error");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      showNotification("Failed to connect to server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setAdminToken("");
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
        <div className="w-full max-w-md p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
          <h2 className="text-3xl font-serif font-semibold mb-6 text-center text-white">
            Not Authenticated
          </h2>
          <p className="text-center text-slate-300 mb-6">
            Please log in via the footer to access the admin dashboard.
          </p>
          <button
            onClick={onClose}
            className="w-full px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(
    (b) => b.payment_status === "pending",
  );
  const confirmedBookings = bookings.filter(
    (b) => b.payment_status === "confirmed",
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/95 backdrop-blur-sm modal-scroll">
      <div className="min-h-screen p-5">
        <div className="max-w-6xl mx-auto">
          {/* Header & Navigation */}
          <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 sm:gap-0">
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-white text-center sm:text-left">
                Admin Dashboard
              </h1>
              <div className="flex gap-3 w-full sm:w-auto sm:justify-end">
                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-red-500/50 bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-100"
                >
                  Logout
                </button>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setActiveTab("rooms");
                  setShowForm(false);
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "rooms"
                    ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                🏠 Rooms Management
              </button>
              <button
                onClick={() => {
                  setActiveTab("payments");
                  setShowForm(false);
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center sm:justify-start ${
                  activeTab === "payments"
                    ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                💰 Payment Confirmations
                {pendingBookings.length > 0 && (
                  <span className="ml-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs">
                    {pendingBookings.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("reports");
                  setShowForm(false);
                }}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === "reports"
                    ? "bg-gradient-to-r from-cyan-400 to-teal-600 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                📊 Reports
              </button>
            </div>
          </div>

          {notification && (
            <div
              className={`mb-6 p-4 rounded-xl ${
                notification.type === "success"
                  ? "bg-green-500/20 border border-green-500/50 text-green-100"
                  : "bg-red-500/20 border border-red-500/50 text-red-100"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* ── Rooms Tab ── */}
          {activeTab === "rooms" && (
            <>
              {!showForm && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform"
                  >
                    + Add New Room
                  </button>
                </div>
              )}
              {showForm && (
                <div className="mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-2xl">
                  <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-6 text-white">
                    {editingRoom ? "Edit Room" : "Add New Room"}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Room Key
                        </label>
                        <input
                          type="text"
                          name="key"
                          value={formData.key}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                          placeholder="e.g., couple"
                          required
                          disabled={editingRoom !== null}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-white">
                          Room Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                          placeholder="e.g., Couple Room"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                        placeholder="e.g., ₱2,500/night"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Image URLs
                      </label>
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-2 mb-2"
                        >
                          <input
                            type="url"
                            value={image}
                            onChange={(e) =>
                              handleArrayChange("images", index, e.target.value)
                            }
                            className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                            placeholder="https://example.com/image.jpg"
                          />
                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem("images", index)}
                              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("images")}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
                      >
                        + Add Image
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white">
                        Amenities
                      </label>
                      {formData.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row gap-2 mb-2"
                        >
                          <input
                            type="text"
                            value={amenity}
                            onChange={(e) =>
                              handleArrayChange(
                                "amenities",
                                index,
                                e.target.value,
                              )
                            }
                            className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none transition-colors text-white"
                            placeholder="e.g., WiFi"
                          />
                          {formData.amenities.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("amenities", index)
                              }
                              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("amenities")}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white"
                      >
                        + Add Amenity
                      </button>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50"
                      >
                        {isLoading
                          ? "Saving..."
                          : editingRoom
                            ? "Update Room"
                            : "Create Room"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full sm:w-auto px-5 py-3 rounded-full border border-white/10 font-semibold hover:bg-white/5 transition-colors text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div className="space-y-4">
                {isLoading && rooms.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400">Loading rooms...</p>
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                    <p className="text-slate-400">
                      No rooms found. Add your first room!
                    </p>
                  </div>
                ) : (
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-lg shadow-xl hover:-translate-y-1 transition-transform"
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 w-full">
                          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                            {room.title}
                          </h3>
                          <p className="text-slate-300 mb-3 text-sm sm:text-base">
                            {room.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(Array.isArray(room.amenities)
                              ? room.amenities
                              : JSON.parse(room.amenities || "[]")
                            ).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-xs sm:text-sm"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <p className="text-lg font-semibold text-cyan-400">
                            {room.price}
                          </p>
                          <p className="text-sm text-slate-400 mt-2 break-all">
                            Key:{" "}
                            <code className="bg-white/5 px-2 py-1 rounded">
                              {room.key}
                            </code>
                          </p>
                        </div>
                        <div className="flex w-full sm:w-auto gap-2 sm:ml-4 mt-2 sm:mt-0">
                          <button
                            onClick={() => handleEdit(room)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-100 hover:bg-blue-500/30 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 hover:bg-red-500/30 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* ── Payments Tab ── */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 text-white">
                  ⏳ Pending Payments ({pendingBookings.length})
                </h2>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p>No pending payments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <PendingPaymentCard
                        key={booking.id}
                        booking={booking}
                        onConfirmPayment={handleConfirmPayment}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 text-white">
                  ✅ Confirmed Bookings ({confirmedBookings.length})
                </h2>
                {confirmedBookings.length === 0 ? (
                  <div className="text-center py-12 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                    <p className="text-slate-400">No confirmed bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {confirmedBookings.map((booking) => (
                      <ConfirmedBookingCard
                        key={booking.id}
                        booking={booking}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Reports Tab ── */}
          {activeTab === "reports" && (
            <ReportsTab adminToken={adminToken} API_URL={API_URL} />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Confirmed Booking Card (with Print Receipt button) ────────────────────
function ConfirmedBookingCard({ booking }) {
  const receiptRef = useRef(null);
  const { generatePDF } = useReportPDF();
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintReceipt = async () => {
    setIsPrinting(true);
    try {
      await generatePDF(receiptRef, `Receipt-${booking.booking_reference}.pdf`);
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 backdrop-blur-lg shadow-xl">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              {booking.guest_name}
            </h3>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-100 text-sm font-semibold">
              CONFIRMED
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Room Type</p>
              <p className="text-slate-200 capitalize">{booking.room_type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Check-in → Check-out</p>
              <p className="text-slate-200">
                {new Date(booking.check_in).toLocaleDateString()} →{" "}
                {new Date(booking.check_out).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Amount</p>
              <p className="text-lg font-semibold text-cyan-400">
                ₱{booking.total_amount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Booking Reference</p>
              <code className="text-sm font-mono bg-white/5 px-2 py-1 rounded text-white">
                {booking.booking_reference}
              </code>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4">
          <button
            onClick={handlePrintReceipt}
            disabled={isPrinting}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-600 text-white font-semibold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50 whitespace-nowrap"
          >
            {isPrinting ? "Generating..." : "🖨 Print Receipt"}
          </button>
        </div>
      </div>

      {/* Hidden receipt template */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={receiptRef} style={{ display: "none" }}>
          <BookingReceiptTemplate booking={booking} />
        </div>
      </div>
    </div>
  );
}

// Separate Component for Pending Payment Card
function PendingPaymentCard({ booking, onConfirmPayment, isLoading }) {
  const [paymentType, setPaymentType] = useState("deposit"); // "deposit" or "full"
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const depositAmount = booking.deposit_amount || 0;
  const totalAmount = booking.total_amount || 0;
  const balanceAmount = totalAmount - depositAmount;
  const rawDate = booking.created_at;
  const date = new Date(rawDate);
  const formatted = format(date, "MMM dd, yyyy hh:mm a");

  const handleConfirm = () => {
    let paidAmount;

    if (showCustomInput) {
      paidAmount = parseFloat(customAmount) || depositAmount;
    } else if (paymentType === "full") {
      paidAmount = totalAmount;
    } else {
      paidAmount = depositAmount;
    }

    onConfirmPayment(booking.id, paidAmount);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/30 backdrop-blur-lg shadow-xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xl font-semibold text-white">
              {booking.guest_name}
            </h3>
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-100 text-sm font-semibold">
              PENDING
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="break-all">
              <p className="text-sm text-slate-400">Guest Email</p>
              <p className="text-slate-200">{booking.guest_email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Guest Phone</p>
              <p className="text-slate-200">{booking.guest_phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Room Type</p>
              <p className="text-slate-200 capitalize">{booking.room_type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Guests</p>
              <p className="text-slate-200">{booking.guests_count} guest(s)</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Check-in</p>
              <p className="text-slate-200">
                {new Date(booking.check_in).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Check-out</p>
              <p className="text-slate-200">
                {new Date(booking.check_out).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Created At</p>
              <p className="text-sm text-slate-200">{formatted}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
            <div>
              <p className="text-sm text-slate-400">Total Amount</p>
              <p className="text-lg font-semibold text-cyan-400">
                ₱{totalAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Deposit (50%)</p>
              <p className="text-lg font-semibold text-yellow-400">
                ₱{depositAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Balance</p>
              <p className="text-lg font-semibold text-orange-400">
                ₱{balanceAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Payment Type Selection */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 mb-4">
            <p className="text-sm text-slate-300 font-semibold mb-3">
              💰 Payment Received:
            </p>

            <div className="space-y-2 mb-3">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`payment-type-${booking.id}`}
                  value="deposit"
                  checked={paymentType === "deposit" && !showCustomInput}
                  onChange={() => {
                    setPaymentType("deposit");
                    setShowCustomInput(false);
                  }}
                  className="w-4 h-4 text-yellow-500"
                />
                <div className="flex-1">
                  <span className="text-white font-medium">
                    Deposit Only (50%)
                  </span>
                  <span className="text-yellow-400 font-bold ml-2">
                    ₱{depositAmount.toLocaleString()}
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`payment-type-${booking.id}`}
                  value="full"
                  checked={paymentType === "full" && !showCustomInput}
                  onChange={() => {
                    setPaymentType("full");
                    setShowCustomInput(false);
                  }}
                  className="w-4 h-4 text-green-500"
                />
                <div className="flex-1">
                  <span className="text-white font-medium">
                    Full Payment (100%)
                  </span>
                  <span className="text-green-400 font-bold ml-2">
                    ₱{totalAmount.toLocaleString()}
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`payment-type-${booking.id}`}
                  value="custom"
                  checked={showCustomInput}
                  onChange={() => setShowCustomInput(true)}
                  className="w-4 h-4 text-cyan-500 shrink-0"
                />
                <div className="flex-1">
                  <span className="text-white font-medium">Custom Amount</span>
                </div>
              </label>
            </div>

            {showCustomInput && (
              <div className="mt-3">
                <label className="block text-sm text-slate-300 mb-2">
                  Enter Amount Paid (₱)
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  step="100"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`e.g., ${depositAmount}`}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Enter the exact amount the guest paid
                </p>
              </div>
            )}

            {/* Payment Summary */}
            <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">
                  Amount to Confirm:
                </span>
                <span className="text-lg font-bold text-cyan-300">
                  ₱
                  {showCustomInput
                    ? (parseFloat(customAmount) || 0).toLocaleString()
                    : paymentType === "full"
                      ? totalAmount.toLocaleString()
                      : depositAmount.toLocaleString()}
                </span>
              </div>
              {(!showCustomInput || customAmount) && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-400">
                    Remaining Balance:
                  </span>
                  <span className="text-sm font-semibold text-orange-300">
                    ₱
                    {showCustomInput
                      ? Math.max(
                          0,
                          totalAmount - (parseFloat(customAmount) || 0),
                        ).toLocaleString()
                      : paymentType === "full"
                        ? "0"
                        : balanceAmount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-slate-400">Booking Reference</p>
            <code className="text-lg font-mono bg-white/5 px-3 py-1 rounded text-white">
              {booking.booking_reference}
            </code>
          </div>

          {booking.special_requests && (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Special Requests</p>
              <p className="text-slate-200">{booking.special_requests}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={isLoading || (showCustomInput && !customAmount)}
          className="w-full md:w-auto mt-4 md:mt-0 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold shadow-lg hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          ✓ Confirm Payment
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
