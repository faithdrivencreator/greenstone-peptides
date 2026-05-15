// Maps each Greenstone Wellness product slug to its exact name in the
// Greenstone Rx supplier catalog (bloom.greenstonerx.com).
//
// Purpose: the order-notification email Pete receives needs to show the
// supplier's product name verbatim, so he can drop the same SKU into the
// supplier portal without translation.
//
// Update this file whenever the supplier renames a SKU or adds/removes one.
// Reconcile via: node scripts/reconcile-supplier-catalog.mjs

export interface SupplierMapping {
  supplierName: string;
  supplierCost: number; // USD, as listed in the supplier portal
}

export const SUPPLIER_MAPPING: Record<string, SupplierMapping> = {
  // ─── Starter Kits (Supply) ──────────────────────────────────────────
  '5-day-starter-kit':   { supplierName: '5 Day Syringe & Alcohol pad Kit',  supplierCost: 10.00 },
  '10-day-starter-kit':  { supplierName: '10 Day Syringe & Alcohol pad Kit', supplierCost: 15.00 },
  '15-day-starter-kit':  { supplierName: '15 Day Syringe & Alcohol pad Kit', supplierCost: 20.00 },
  '20-day-starter-kit':  { supplierName: '20 Day Syringe & Alcohol pad Kit', supplierCost: 25.00 },

  // ─── Peptides (Recovery / Anti-aging) ───────────────────────────────
  'bpc-157-5mg':         { supplierName: 'BPC-157 5mg Injectable (5ml vial)',           supplierCost: 85.00 },
  'bpc-157-10mg-ml':     { supplierName: 'BPC-157 10mg/ml Injectable 5ml',              supplierCost: 120.00 },
  'ghk-cu-50mg':         { supplierName: 'GHK-Cu 50mg/ml Injectable 5ml',               supplierCost: 110.00 },
  'mots-c-20mg':         { supplierName: 'MOTS-c 20mg/ml 5ml vial',                     supplierCost: 110.00 },
  'tb-500-5mg':          { supplierName: 'TB-500 (Thymosin Beta-4) 5mg/ml Injectable 5mL', supplierCost: 110.00 },
  'tb-500-10mg-ml':      { supplierName: 'TB-500 10mg Injectable 5mL (vial) 50mg',      supplierCost: 145.00 },
  'sermorelin-4mg':      { supplierName: 'Sermorelin 4mg/ml Injectable (5ml vial)',     supplierCost: 60.00 },
  'tesamorelin-5mg':     { supplierName: 'Tesamorelin 5mg/ml Injectable 5 mL',          supplierCost: 85.00 },

  // ─── NAD+ ───────────────────────────────────────────────────────────
  'nad-plus-50mg':       { supplierName: 'NAD+ 50mg/ml Injectable 5ml',       supplierCost: 60.00 },
  'nad-plus-200mg-ml':   { supplierName: 'NAD+ 200mg/ml Injectable 5ml',      supplierCost: 90.00 },
  'nad-plus-nasal-spray':{ supplierName: 'NAD+ 300mg/ml Nasal Spray 15ml',    supplierCost: 120.00 },

  // ─── Combos ─────────────────────────────────────────────────────────
  'semaglutide-nad-combo':       { supplierName: 'Semaglutide/NAD+ 2.5/50 mg/mL Injectable 5ml',    supplierCost: 120.00 },
  'tirzepatide-glycine-20mg-5mg':{ supplierName: 'Tirzepatide/Glycine 20mg/5mg Injectable 5ml',     supplierCost: 105.00 },
  'tirzepatide-nad-combo':       { supplierName: 'Tirzepatide/NAD+ 20mg/200mg Injectable 5ml',      supplierCost: 215.00 },

  // ─── Semaglutide ODT ────────────────────────────────────────────────
  'semaglutide-0-5mg-odt-30ct':  { supplierName: 'Semaglutide Oral RDT 0.50mg (30-Tablets)',     supplierCost: 55.00 },
  'semaglutide-0-5mg-odt-60ct':  { supplierName: 'Semaglutide Oral RDT 0.50mg (60-Tablets)',     supplierCost: 80.00 },
  'semaglutide-0-5mg-odt-90ct':  { supplierName: 'Semaglutide Oral RDT 0.50mg ODT 90-Tablets',   supplierCost: 105.00 },
  'semaglutide-1-5mg-odt-30ct':  { supplierName: 'Semaglutide 1.50mg Oral ODT 30 Tablets',       supplierCost: 110.00 },
  'semaglutide-1-5mg-odt-60ct':  { supplierName: 'Semaglutide 1.50mg Oral ODT 60 Tablets',       supplierCost: 165.00 },
  'semaglutide-1-5mg-odt-90ct':  { supplierName: 'Semaglutide 1.50mg Oral ODT 90 Tablets',       supplierCost: 195.00 },

  // ─── Semaglutide Injectable ─────────────────────────────────────────
  'semaglutide-2-5mg-ml-0-5ml':  { supplierName: 'Semaglutide Injectable 2.5mg/mL (0.5mL vial)', supplierCost: 40.00 },
  'semaglutide-2-5mg-ml-1ml':    { supplierName: 'Semaglutide Injectable 2.5mg/mL (1mL vial)',   supplierCost: 45.00 },
  'semaglutide-2-5mg-ml-2ml':    { supplierName: 'Semaglutide Injectable 2.5mg/mL (2mL vial)',   supplierCost: 70.00 },
  'semaglutide-2-5mg-ml-3ml':    { supplierName: 'Semaglutide Injectable 2.5mg/mL (3mL vial)',   supplierCost: 85.00 },
  'semaglutide-2-5mg-ml-4ml':    { supplierName: 'Semaglutide Injectable 2.5mg/mL (4mL vial)',   supplierCost: 90.00 },
  'semaglutide-5mg-2ml':         { supplierName: 'Semaglutide Injectable 5mg/mL (2mL vial)',     supplierCost: 105.00 },
  'semaglutide-5mg-ml-5ml':      { supplierName: 'Semaglutide Injectable 5mg/mL (5mL vial)',     supplierCost: 130.00 },
  'semaglutide-10mg-ml-5ml':     { supplierName: 'Semaglutide Injectable 10mg/mL (5mL vial)',    supplierCost: 175.00 },

  // ─── Tirzepatide ODT ────────────────────────────────────────────────
  'tirzepatide-0-5mg-odt-30ct':  { supplierName: 'Tirzepatide Oral RDT 0.50mg (30 Tablets)',     supplierCost: 70.00 },
  'tirzepatide-0-5mg-odt-60ct':  { supplierName: 'Tirzepatide Oral RDT 0.50mg (60 Tablets)',     supplierCost: 90.00 },
  'tirzepatide-0-5mg-odt-90ct':  { supplierName: 'Tirzepatide Oral RDT 0.50mg (90-Tablets)',     supplierCost: 115.00 },

  // ─── Tirzepatide Injectable 10mg/mL ─────────────────────────────────
  'tirzepatide-10mg-1ml':        { supplierName: 'Tirzepatide Injectable 10mg/mL (1mL vial)',    supplierCost: 70.00 },
  'tirzepatide-10mg-ml-2ml':     { supplierName: 'Tirzepatide Injectable 10mg/mL (2mL vial)',    supplierCost: 90.00 },
  'tirzepatide-10mg-3ml':        { supplierName: 'Tirzepatide Injectable 10mg/mL (3mL vial)',    supplierCost: 120.00 },
  'tirzepatide-10mg-ml-4ml':     { supplierName: 'Tirzepatide Injectable 10mg/mL (4mL vial)',    supplierCost: 150.00 },
  'tirzepatide-10mg-ml-5ml':     { supplierName: 'Tirzepatide Injectable 10mg/mL (5mL vial)',    supplierCost: 175.00 },

  // ─── Tirzepatide Injectable 15mg/mL ─────────────────────────────────
  'tirzepatide-15mg-1ml':        { supplierName: 'Tirzepatide Injectable 15mg/mL (1mL vial)',    supplierCost: 80.00 },
  'tirzepatide-15mg-2ml':        { supplierName: 'Tirzepatide Injectable 15mg/mL (2mL vial)',    supplierCost: 120.00 },
  'tirzepatide-15mg-3ml':        { supplierName: 'Tirzepatide Injectable 15mg/mL (3mL vial)',    supplierCost: 160.00 },
  'tirzepatide-15mg-4ml':        { supplierName: 'Tirzepatide Injectable 15mg/mL (4mL vial)',    supplierCost: 195.00 },
  // 'tirzepatide-15mg-5ml': DEACTIVATED — supplier no longer carries 15mg/5mL
  //   as of 2026-05-14. Kept in catalog with active=false so historical orders
  //   still resolve correctly. Re-activate if supplier brings it back.

  // ─── Tirzepatide Injectable 20mg/mL ─────────────────────────────────
  'tirzepatide-20mg-1ml':        { supplierName: 'Tirzepatide Injectable 20mg/mL (1mL vial)',    supplierCost: 90.00 },
  'tirzepatide-20mg-3ml':        { supplierName: 'Tirzepatide Injectable 20mg/mL (3mL vial)',    supplierCost: 195.00 },
  'tirzepatide-20mg-5ml':        { supplierName: 'Tirzepatide Injectable 20mg/mL (5mL vial)',    supplierCost: 235.00 },

  // ─── Retatrutide ────────────────────────────────────────────────────
  'retatrutide-20mg-ml-1ml':     { supplierName: 'Retatrutide Injectable 20mg/mL (1mL vial)',    supplierCost: 205.00 },
  'retatrutide-20mg-ml-3ml':     { supplierName: 'Retatrutide Injectable 20mg/mL (3mL Vial)',    supplierCost: 290.00 },
  'retatrutide-20mg-ml-5ml':     { supplierName: 'Retatrutide Injectable 20mg/mL (5ml vial)',    supplierCost: 340.00 },

  // ─── Other ──────────────────────────────────────────────────────────
  'sildenafil-tadalafil-55-22mg-odt': { supplierName: 'Sildenafil/Tadalafil 55/22mg ODT 30ct',   supplierCost: 85.00 },
  // 'ivermectin-3mg-odt' — inactive on site; supplier carries "Ivermectin 3mg ODT 60" at $42.50.
  // 'tester-cream'       — inactive on site; supplier "Tester Cream" $5 — not for sale.
};

/**
 * Look up supplier info by slug. Returns null if not mapped (e.g. orphan, future SKU).
 */
export function getSupplierMapping(slug: string): SupplierMapping | null {
  return SUPPLIER_MAPPING[slug] ?? null;
}

/**
 * Look up by display name (the way Stripe's line_item.description appears in webhooks).
 * The webhook gets a name like "BPC-157 5mg" and needs the supplier mapping.
 * This map is built from the local product catalog at runtime by the webhook.
 */
