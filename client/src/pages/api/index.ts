import { Connection, Client } from '@temporalio/client';


async function run(songIndex: number) {
    // Connect to the default Server location
    const connection = await Connection.connect({ address: 'localhost:7233' });
    // In production, pass options to configure TLS and other settings:
    // {
    //   address: 'foo.bar.tmprl.cloud',
    //   tls: {}
    // }

    const client = new Client({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });

    let oldHandle = client.workflow.getHandle('workflow-abcd');

    // await oldHandle.signal('client-terminate');
    try {
        await oldHandle.terminate().catch((err) => {
            console.error('Error terminating workflow:', err);
        }
        );
    } catch (err) {
        console.error('Error terminating workflow:', err);
    }





    const handle = await client.workflow.start('game', {
        taskQueue: 'main',
        args: [{
            index: songIndex,
        }], // pass the name as an argument to the workflow
        // type inference works! args: [name: string]
        // in practice, use a meaningful business ID, like customerId or transactionId
        workflowId: 'workflow-' + 'abcd' //nanoid(),
    });
    console.log(`Started workflow ${handle.workflowId}`);

    // optional: wait for client result
    const results = await handle.result(); // Hello, Temporal!
    return results
}

async function guess(name: string, song: string) {
    // Connect to the default Server location
    const connection = await Connection.connect({ address: 'localhost:7233' });
    // In production, pass options to configure TLS and other settings:
    // {
    //   address: 'foo.bar.tmprl.cloud',
    //   tls: {}
    // }

    const client = new Client({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });

    const handle = client.workflow.getHandle('workflow-abcd');

    // Send a signal to the workflow
    try {

        await handle.signal('client-guess', {
            name: name,
            song: song,
        });
    }
    catch (err) {
        console.error('Error sending signal:', err);
    }




    return true
}


export async function GET({ request }: { request: Request }) {
    const url = new URL(request.url);
    const index = url.searchParams.get('index');
    const params = {
        index: parseInt(index || '0'),
    }

    console.log(params);

    try {
        if (params.index === undefined) {
            return new Response(JSON.stringify({
                status: "error",
                message: "No index provided",
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        if (isNaN(params.index) || params.index < 0) {
            return new Response(JSON.stringify({
                status: "error",
                message: "Index must be a number > 0",
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }


        const results = await run(params.index);
        return new Response(JSON.stringify({
            status: "success",
            data: results,
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            status: "error",
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export async function POST({ request }: { request: Request }) {
    try {
        const body = await request.json();
        console.log(body);
        const name = body.name as string;
        const song = body.song as string;

        console.log(name, song);

        if (!name || !song) {
            return new Response(JSON.stringify({
                status: "error",
                message: "Name and song are required",
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const results = await guess(name, song);
        return new Response(JSON.stringify({
            status: "success",
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            status: "error",
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

}


export const prerender = false;
