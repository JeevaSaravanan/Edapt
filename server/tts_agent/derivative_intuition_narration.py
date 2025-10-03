"""
Narration data for the intuitive derivative explanation.
A more conceptual and engaging approach to understanding derivatives.
"""

DERIVATIVE_INTUITION_NARRATION = [
    {
        "timestamp": "[0:00 - 0:10]",
        "section": "The Speedometer Paradox",
        "text": "You're driving down the highway, and your speedometer reads 60 miles per hour. But here's a puzzling question: what does that number actually mean right now, at this exact instant?"
    },
    {
        "timestamp": "[0:11 - 0:20]",
        "section": "The Paradox Deepens",
        "text": "Speed is distance divided by time. But at a single frozen moment, no time has passed and no distance has been covered. So how can you have a speed? This paradox stumped mathematicians for two thousand years."
    },
    {
        "timestamp": "[0:21 - 0:30]",
        "section": "Newton and Leibniz's Insight",
        "text": "Newton and Leibniz had a brilliant insight in the 1600s: you can't measure an instant directly, but you can get infinitely close to it."
    },
    {
        "timestamp": "[0:31 - 0:50]",
        "section": "The Limiting Process",
        "text": "Imagine calculating your average speed over one minute. Then over one second. Then over one millisecond. As you shrink the time interval closer and closer to zero, your average speed approaches a specific number. That number—the one you're approaching but never quite calculating with actual zero time—is your instantaneous speed. That's a derivative."
    },
    {
        "timestamp": "[0:51 - 1:05]",
        "section": "Geometric Interpretation",
        "text": "Here's another way to see it. Draw a curve on paper. Pick a point on it, then pick another point nearby. Connect them with a straight line. That line's slope tells you the average rate of change between those points."
    },
    {
        "timestamp": "[1:06 - 1:20]",
        "section": "The Tangent Line",
        "text": "Now slide the second point closer... closer... infinitely close. The line rotates until it just barely kisses the curve at a single point—it becomes a tangent line. The slope of that tangent line is the derivative."
    },
    {
        "timestamp": "[1:21 - 1:30]",
        "section": "Core Definition",
        "text": "A derivative measures how fast something is changing at a precise moment. It's the instantaneous rate of change."
    },
    {
        "timestamp": "[1:31 - 1:50]",
        "section": "Real World Applications",
        "text": "Position changing over time? The derivative is velocity. Velocity changing? The derivative is acceleration. A hillside's height changing? The derivative is the steepness. Temperature changing? The derivative tells you how fast it's rising or falling."
    },
    {
        "timestamp": "[1:51 - 2:05]",
        "section": "Concrete Example",
        "text": "For the simple function f of x equals x squared, the derivative is f prime of x equals 2x. At any point, the curve's steepness is exactly twice the x-value. At x equals zero, it's flat. At x equals 2, it's rising with a slope of 4."
    },
    {
        "timestamp": "[2:06 - 2:25]",
        "section": "Historical Impact",
        "text": "Before derivatives, we could only understand average behavior. With derivatives, we can analyze change with perfect precision at every single point. This unlocked modern physics, engineering, economics, and nearly every field that deals with change and motion."
    },
    {
        "timestamp": "[2:26 - 2:40]",
        "section": "Conclusion",
        "text": "The derivative is our mathematical way of capturing something profound: the rate of change in an ever-changing world. It lets us freeze a moment and ask, what's happening right now? That simple question, and its answer, changed everything."
    }
]

def get_full_narration_text():
    """Returns the complete narration as a single text string."""
    return " ".join([segment["text"] for segment in DERIVATIVE_INTUITION_NARRATION])

def get_narration_segments():
    """Returns the narration broken into segments."""
    return DERIVATIVE_INTUITION_NARRATION

def get_total_duration():
    """Returns the estimated total duration in seconds."""
    return 160  # Approximately 2:40

if __name__ == "__main__":
    print("Derivative Intuition Narration")
    print("=" * 60)
    print(f"Total segments: {len(DERIVATIVE_INTUITION_NARRATION)}")
    print(f"Estimated duration: {get_total_duration()} seconds (~2:40)")
    print(f"Total characters: {len(get_full_narration_text())}")
    print("\nSegments:")
    for i, segment in enumerate(DERIVATIVE_INTUITION_NARRATION, 1):
        print(f"\n{i}. {segment['section']} {segment['timestamp']}")
        print(f"   {segment['text'][:80]}...")
