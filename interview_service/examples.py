"""
Example Usage of CareerPilot Interview Service

This module demonstrates how to:
1. Start an interview session
2. Use the WebSocket connection
3. Handle responses
4. End the session
"""

import asyncio
import websockets
import json
import httpx

# ==================== Configuration ====================

INTERVIEW_SERVICE_URL = "http://localhost:8001"
WEBSOCKET_URL = "ws://localhost:8001"

# ==================== Example 1: REST API ====================

async def example_rest_api():
    """
    Example: Using REST endpoints to manage interview session
    """
    print("=" * 50)
    print("Example 1: REST API Usage")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Health check
        response = await client.get(f"{INTERVIEW_SERVICE_URL}/health")
        print(f"✅ Health: {response.json()}")
        
        # Start interview
        print("\n📝 Starting interview...")
        response = await client.post(
            f"{INTERVIEW_SERVICE_URL}/interviews/start",
            json={
                "cv_text": "Full Stack Developer with 5 years experience in React and Node.js",
                "session_id": "example-session-1"
            }
        )
        session_data = response.json()
        print(f"✅ Session started: {session_data['session_id']}")
        print(f"   Message: {session_data['message']}")
        
        session_id = session_data['session_id']
        
        # Simulate some conversation (would be WebSocket in real usage)
        await asyncio.sleep(2)
        
        # Get history
        print("\n📊 Getting conversation history...")
        response = await client.get(f"{INTERVIEW_SERVICE_URL}/interviews/{session_id}/history")
        history = response.json()
        print(f"✅ Duration: {history['duration']:.1f}s")
        print(f"   Messages: {len(history['conversation'])}")
        
        # End interview
        print("\n🏁 Ending interview...")
        response = await client.delete(f"{INTERVIEW_SERVICE_URL}/interviews/{session_id}")
        end_data = response.json()
        print(f"✅ Interview ended")
        print(f"   Total messages: {end_data['messages_count']}")
        print(f"   Duration: {end_data['duration']:.1f}s")


# ==================== Example 2: WebSocket Connection ====================

async def example_websocket():
    """
    Example: WebSocket connection and audio streaming
    """
    print("\n" + "=" * 50)
    print("Example 2: WebSocket Audio Streaming")
    print("=" * 50)
    
    # First, create a session
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{INTERVIEW_SERVICE_URL}/interviews/start",
            json={"session_id": "ws-example"}
        )
        session_id = response.json()['session_id']
    
    # Connect via WebSocket
    ws_url = f"{WEBSOCKET_URL}/ws/interview/{session_id}"
    print(f"🔌 Connecting to {ws_url}")
    
    try:
        async with websockets.connect(ws_url) as websocket:
            print("✅ Connected!")
            
            # Receive initial message
            message = await websocket.recv()
            print(f"📨 Received: {json.loads(message)}")
            
            # In a real scenario, you would send audio data here
            # For demo, just receive a few messages
            for i in range(3):
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=5)
                    data = json.loads(message)
                    print(f"📨 Message {i+1}: {data.get('type')}")
                except asyncio.TimeoutError:
                    print(f"⏱️  Timeout waiting for message {i+1}")
                    break
    
    except Exception as e:
        print(f"❌ WebSocket error: {e}")


# ==================== Example 3: React Frontend Integration ====================

react_example = """
// React Component Example

import React, { useState } from 'react';
import InterviewCall from './pages/InterviewCall';

export function InterviewPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [sessionId] = useState('user-' + Date.now());
  const [cvText] = useState(
    'Your CV text here or fetch from user profile...'
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>📞 AI Interview Practice</h1>
      
      {!isStarted ? (
        <button 
          onClick={() => setIsStarted(true)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Start Interview Session
        </button>
      ) : (
        <div>
          <InterviewCall 
            sessionId={sessionId}
            cvText={cvText}
          />
        </div>
      )}
    </div>
  );
}
"""

# ==================== Example 4: Python Client Library ====================

class InterviewClient:
    """
    Python client for Interview Service
    """
    
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.session_id = None
        self.client = httpx.AsyncClient()
    
    async def start_interview(self, cv_text=None):
        """Start new interview session"""
        response = await self.client.post(
            f"{self.base_url}/interviews/start",
            json={"cv_text": cv_text}
        )
        data = response.json()
        self.session_id = data['session_id']
        return data
    
    async def get_history(self):
        """Get conversation history"""
        if not self.session_id:
            raise ValueError("No active session")
        
        response = await self.client.get(
            f"{self.base_url}/interviews/{self.session_id}/history"
        )
        return response.json()
    
    async def end_interview(self):
        """End interview session"""
        if not self.session_id:
            raise ValueError("No active session")
        
        response = await self.client.delete(
            f"{self.base_url}/interviews/{self.session_id}"
        )
        data = response.json()
        self.session_id = None
        return data
    
    async def close(self):
        """Close client"""
        await self.client.aclose()


async def example_python_client():
    """
    Example: Using Python client library
    """
    print("\n" + "=" * 50)
    print("Example 3: Python Client")
    print("=" * 50)
    
    client = InterviewClient()
    
    try:
        # Start interview
        print("🚀 Starting interview...")
        result = await client.start_interview(
            cv_text="Python Developer, 3 years experience"
        )
        print(f"✅ Session ID: {client.session_id}")
        print(f"   Message: {result['message']}")
        
        # Get history
        await asyncio.sleep(2)
        print("\n📊 Getting history...")
        history = await client.get_history()
        print(f"✅ Conversation messages: {len(history['conversation'])}")
        
        # End interview
        print("\n🏁 Ending interview...")
        result = await client.end_interview()
        print(f"✅ Interview ended: {result['status']}")
        
    finally:
        await client.close()


# ==================== Example 5: API Request with httpx ====================

async def example_manual_api_calls():
    """
    Example: Manual API calls using httpx
    """
    print("\n" + "=" * 50)
    print("Example 4: Manual API Calls")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # POST to start interview
        print("📤 POST /interviews/start")
        response = await client.post(
            f"{INTERVIEW_SERVICE_URL}/interviews/start",
            json={
                "cv_text": "Full Stack Developer",
                "session_id": "manual-api-test"
            },
            timeout=10.0
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        session_id = response.json()['session_id']
        
        # GET history
        print(f"\n📤 GET /interviews/{session_id}/history")
        response = await client.get(
            f"{INTERVIEW_SERVICE_URL}/interviews/{session_id}/history"
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        # DELETE to end
        print(f"\n📤 DELETE /interviews/{session_id}")
        response = await client.delete(
            f"{INTERVIEW_SERVICE_URL}/interviews/{session_id}"
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")


# ==================== Main ====================

async def main():
    """Run all examples"""
    
    print("\n🚀 CareerPilot Interview Service Examples")
    print("=" * 50)
    
    try:
        # Example 1: REST API
        await example_rest_api()
        
        # Example 3: Python Client
        await example_python_client()
        
        # Example 4: Manual API Calls
        await example_manual_api_calls()
        
        # WebSocket example (requires server running)
        # await example_websocket()
        
        print("\n✅ Examples completed!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    # Print React example
    print("\n" + "=" * 50)
    print("React Frontend Integration Example")
    print("=" * 50)
    print(react_example)
    
    # Run async examples
    asyncio.run(main())
