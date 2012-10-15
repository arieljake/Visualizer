

function numFormat(value,params)
{
	value = value.toFixed(2);

	if (params)
	{
		if (params.suffix)
			value += params.suffix;
	}

	return value;
};


function toPercent(top,bot)
{
	return top*100/bot;
};