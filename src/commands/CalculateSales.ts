import type { CommandConfig } from '@@types/commands';

import { Client, isFullPageOrDatabase } from '@notionhq/client';

import { ENV } from '@@constants/index';
import { notion as notionUtils } from '@@utils/index';

async function CalculateSales() {
    const notion = new Client({ auth: ENV.NOTION_SECRET });

    const databaseId = ENV.NOTION_SALES_DATABASE_ID;
    const totalSalesBlockId = ENV.NOTION_TOTAL_SALES_BLOCK_ID;
    const onlineSalesBlockId = ENV.NOTION_ONLINE_SALES_BLOCK_ID;
    const eventSalesBlockId = ENV.NOTION_EVENT_SALES_BLOCK_ID;

    const query = await notion.databases.query({
        database_id: databaseId,
        filter_properties: ["vFmv", "TE%3F_"]
    });

    const totalSales = { amount: 0, revenue: 0 };
    const onlineSales = { amount: 0, revenue: 0 };
    const eventSales = { amount: 0, revenue: 0 };

    for(let i = 0; i < query.results.length; i++) {
        const currentRow = query.results[i];
        
        if(!isFullPageOrDatabase(currentRow)) {
            continue;
        }

        const soldForProperty = currentRow.properties["Sold For"];
        const purchasedAtProperty = currentRow.properties["Purchased At"];
    
        if (soldForProperty.type === "formula" && notionUtils.isStringFormula(soldForProperty.formula)) {

            if(purchasedAtProperty.type === "multi_select" && notionUtils.isMultiSelectProperty(purchasedAtProperty)) {
                const choices = purchasedAtProperty.multi_select.map((choice) => choice.name);
                if(choices.includes("Etsy")) {
                    onlineSales.amount++;
                    onlineSales.revenue += Number(soldForProperty.formula.string) ?? 0;
                }

                if(choices.includes("Event / Fair")) {
                    eventSales.amount++;
                    eventSales.revenue += Number(soldForProperty.formula.string) ?? 0;
                }
            }

            totalSales.amount++;
            totalSales.revenue += Number(soldForProperty.formula.string) ?? 0;
        }
    };

    // Update Total Sales Block
    await notion.blocks.update({
        block_id: totalSalesBlockId,
        callout: {
            rich_text: [
                {
                    text: {
                        content: "Total Sales: "
                    },
                    annotations: {
                        bold: true
                    }
                },
                {
                    text: {
                        content: `$${totalSales.revenue.toLocaleString()} `
                    }
                },
                {
                    text: {
                        content: `(${query.results.length})`
                    },
                    annotations: {
                        code: true
                    }
                }
            ]
        }
    });

    // Update Online Sales Block
    await notion.blocks.update({
        block_id: onlineSalesBlockId,
        callout: {
            rich_text: [
                {
                    text: {
                        content: "Online Sales: "
                    },
                    annotations: {
                        bold: true
                    }
                },
                {
                    text: {
                        content: `$${onlineSales.revenue.toLocaleString()} `
                    }
                },
                {
                    text: {
                        content: `(${onlineSales.amount} / ${query.results.length})`
                    },
                    annotations: {
                        code: true
                    }
                }
            ]
        }
    });

    // Update Event Sales Block
    await notion.blocks.update({
        block_id: eventSalesBlockId,
        callout: {
            rich_text: [
                {
                    text: {
                        content: "Event Sales: "
                    },
                    annotations: {
                        bold: true
                    }
                },
                {
                    text: {
                        content: `$${eventSales.revenue.toLocaleString()} `
                    }
                },
                {
                    text: {
                        content: `(${eventSales.amount} / ${query.results.length})`
                    },
                    annotations: {
                        code: true
                    }
                }
            ]
        }
    });
};

export const config: CommandConfig = {
    aliases: [],
    description: "Update blocks to display sale related sum data"
};

export default CalculateSales;