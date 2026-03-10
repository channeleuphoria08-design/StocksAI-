import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

async function run() {
  try {
    const queryOptions = { period1: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] };
    const history = await yahooFinance.chart('AAPL', queryOptions);
    console.log("Success", history.quotes.length);
  } catch (e: any) {
    console.error(e.message);
    if (e.errors) {
      console.error(JSON.stringify(e.errors, null, 2));
    }
  }
}

run();