import Pusher from 'pusher';

// Replace with your Pusher app ID, key, secret, and cluster (from your Vercel Environment Variables)
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
});

export default async (req, res) => {
    if (req.method === 'POST') {
        const { message } = req.body;
        const username = 'Anonymous'; // You can implement a way to generate pseudo-anonymous names if desired
        const channelName = 'general-chat'; // This should match the channel name in your index.html

        if (message && typeof message === 'string' && message.trim() !== '') {
            try {
                await pusher.trigger(channelName, 'new-message', {
                    username: username,
                    text: message.trim()
                });
                res.status(200).json({ success: true });
            } catch (error) {
                console.error('Error triggering Pusher event:', error);
                res.status(500).json({ error: 'Failed to send message to Pusher' });
            }
        } else {
            res.status(400).json({ error: 'Message is empty or invalid' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};