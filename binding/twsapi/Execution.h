/* Copyright (C) 2013 Interactive Brokers LLC. All rights reserved. This code is subject to the terms
 * and conditions of the IB API Non-Commercial License or the IB API Commercial License, as applicable. */

#ifndef execution_def
#define execution_def

#include "IBString.h"

struct Execution
{
	Execution()
	{
		shares = 0;
		price = 0;
		permId = 0;
		clientId = 0;
		orderId = 0;
		cumQty = 0;
		avgPrice = 0;
		evMultiplier = 0;
	}

	IBString	execId;
	IBString	time;
	IBString	acctNumber;
	IBString	exchange;
	IBString	side;
	int			shares;
	double		price;
	int			permId;
	long		clientId;
	long		orderId;
	int			liquidation;
	int			cumQty;
	double		avgPrice;
	IBString	orderRef;
	IBString	evRule;
	double		evMultiplier;
};

struct ExecutionFilter
{
	ExecutionFilter()
		: m_clientId(0)
	{
	}

	// Filter fields
	long		m_clientId;
	IBString	m_acctCode;
	IBString	m_time;
	IBString	m_symbol;
	IBString	m_secType;
	IBString	m_exchange;
	IBString	m_side;
};

#endif // execution_def
