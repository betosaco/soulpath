# Telegram Testing Guide

## Current Status
- ✅ Telegram is enabled in the database
- ✅ Bot username: Matmaxcommerce_bot
- ❌ Bot token is invalid/expired (404 error)
- ❌ No chat IDs configured

## Steps to Fix and Test Telegram

### 1. Get a New Bot Token

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with @BotFather
3. **Send `/newbot`** command
4. **Follow the instructions**:
   - Enter a name for your bot (e.g., "MatMax Test Bot")
   - Enter a username for your bot (e.g., "matmax_test_bot")
5. **Copy the bot token** that BotFather gives you (it looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Update the Bot Token

**Option A: Using the Script**
1. Edit the file `update-telegram-token.js`
2. Replace `YOUR_NEW_BOT_TOKEN` with your actual bot token
3. Replace `YOUR_BOT_USERNAME` with your bot username
4. Run: `npx tsx update-telegram-token.js`

**Option B: Using the Admin Panel**
1. Go to your admin communication settings
2. Navigate to Telegram configuration
3. Enter the new bot token
4. Save the configuration

### 3. Get Your Chat ID

To test Telegram, you need a valid chat ID:

1. **Start a chat** with your bot (search for your bot username)
2. **Send `/start`** to the bot
3. **Get your chat ID** using one of these methods:

   **Method 1: Use @userinfobot**
   - Search for `@userinfobot` on Telegram
   - Start a chat with it
   - Send any message
   - It will reply with your user ID (this is your chat ID)

   **Method 2: Check webhook logs**
   - If you have webhook logging enabled, check the logs
   - Look for incoming messages from your bot

   **Method 3: Use a test script**
   - Create a simple script to get updates from your bot

### 4. Test Telegram Functionality

Once you have a valid bot token and chat ID:

1. **Test via Admin Panel**:
   - Go to communication settings
   - Click "Test Telegram Connection"
   - Enter your chat ID
   - Click "Test"

2. **Test via Script**:
   ```bash
   npx tsx test-telegram-with-chatid.js
   ```
   (Update the chat ID in the script first)

3. **Test via API**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/communication/test \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
     -d '{
       "type": "telegram",
       "chatId": "YOUR_CHAT_ID",
       "message": "Test message"
     }'
   ```

## Expected Results

### ✅ Success
- Message appears in your Telegram chat
- API returns success response
- No errors in logs

### ❌ Common Issues
- **404 Error**: Invalid bot token
- **400 Error**: Invalid chat ID
- **403 Error**: Bot is blocked or not started
- **Network Error**: Connection issues

## Troubleshooting

### Bot Token Issues
- Make sure the token is complete (no missing characters)
- Check if the token is expired
- Verify the bot is not deleted

### Chat ID Issues
- Make sure you've started a chat with the bot
- Check if the chat ID is correct (usually a number)
- Ensure the bot is not blocked

### Permission Issues
- Make sure the bot has permission to send messages
- Check if the bot is in a group (group chat IDs are different)

## Next Steps

1. **Get a new bot token** from @BotFather
2. **Update the token** in your database
3. **Get your chat ID** using @userinfobot
4. **Test the functionality** using the admin panel
5. **Verify messages** are received in Telegram

Once these steps are completed, your Telegram integration should be working correctly!
