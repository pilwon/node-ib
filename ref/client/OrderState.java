/* Copyright (C) 2013 Interactive Brokers LLC. All rights reserved.  This code is subject to the terms
 * and conditions of the IB API Non-Commercial License or the IB API Commercial License, as applicable. */

package com.ib.client;


public class OrderState {
    private String m_status;
    private String m_initMargin;
    private String m_maintMargin;
    private String m_equityWithLoan;
    private double m_commission;
    private double m_minCommission;
    private double m_maxCommission;
    private String m_commissionCurrency;
    private String m_warningText;

    // Get
    public double commission()         { return m_commission; }
    public double maxCommission()      { return m_maxCommission; }
    public double minCommission()      { return m_minCommission; }
    public OrderStatus status()        { return OrderStatus.get(m_status); }
    public String getStatus()          { return m_status; }
    public String commissionCurrency() { return m_commissionCurrency; }
    public String equityWithLoan()     { return m_equityWithLoan; }
    public String initMargin()         { return m_initMargin; }
    public String maintMargin()        { return m_maintMargin; }
    public String warningText()        { return m_warningText; }

    // Set
    public void commission(double v)         { m_commission = v; }
    public void commissionCurrency(String v) { m_commissionCurrency = v; }
    public void equityWithLoan(String v)     { m_equityWithLoan = v; }
    public void initMargin(String v)         { m_initMargin = v; }
    public void maintMargin(String v)        { m_maintMargin = v; }
    public void maxCommission(double v)      { m_maxCommission = v; }
    public void minCommission(double v)      { m_minCommission = v; }
    public void status(OrderStatus v)        { m_status = ( v == null ) ? null : v.name(); }
    public void status(String v)             { m_status = v; }
    public void warningText(String v)        { m_warningText = v; }

	OrderState() {
		this (null, null, null, null, 0.0, 0.0, 0.0, null, null);
	}

	OrderState(String status, String initMargin, String maintMargin,
			String equityWithLoan, double commission, double minCommission,
			double maxCommission, String commissionCurrency, String warningText) {
	    m_status = status;
	    m_initMargin = initMargin;
		m_maintMargin = maintMargin;
		m_equityWithLoan = equityWithLoan;
		m_commission = commission;
		m_minCommission = minCommission;
		m_maxCommission = maxCommission;
		m_commissionCurrency = commissionCurrency;
		m_warningText = warningText;
	}

	@Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof OrderState)) {
            return false;
        }
        OrderState state = (OrderState)other;

        if (m_commission != state.m_commission ||
        	m_minCommission != state.m_minCommission ||
        	m_maxCommission != state.m_maxCommission) {
        	return false;
        }

        if (Util.StringCompare(m_status, state.m_status) != 0 ||
        	Util.StringCompare(m_initMargin, state.m_initMargin) != 0 ||
        	Util.StringCompare(m_maintMargin, state.m_maintMargin) != 0 ||
        	Util.StringCompare(m_equityWithLoan, state.m_equityWithLoan) != 0 ||
        	Util.StringCompare(m_commissionCurrency, state.m_commissionCurrency) != 0) {
        	return false;
        }
        return true;
	}

    @Override
    public int hashCode() {
        // Use a few fields as a compromise between performance and hashCode quality.
        int result;
        long temp;
        temp = Double.doubleToLongBits(m_commission);
        result = (int) (temp ^ (temp >>> 32));
        temp = Double.doubleToLongBits(m_minCommission);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        temp = Double.doubleToLongBits(m_maxCommission);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        return result;
    }
}
