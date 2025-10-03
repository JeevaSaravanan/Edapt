"""
Narration data for the derivative explanation video.
Contains the timeline and narration text.
"""

DERIVATIVE_NARRATION = [
    {
        "timestamp": "[0:00 - 0:03]",
        "title": "Title Screen",
        "text": "Welcome to Understanding Derivatives. Let's explore one of the most fundamental concepts in calculus."
    },
    {
        "timestamp": "[0:04 - 0:08]",
        "title": "Axes and Graph Appear",
        "text": "Here we have a simple function: f of x equals x squared. Notice how the curve gets steeper as we move to the right."
    },
    {
        "timestamp": "[0:09 - 0:13]",
        "title": "Secant Line Introduction",
        "text": "Let's start with something familiar: the secant line. This line connects two points on our curve."
    },
    {
        "timestamp": "[0:14 - 0:18]",
        "title": "Two Points and Secant Line",
        "text": "The slope of this secant line represents the average rate of change between these two points. It's calculated as delta y over delta x."
    },
    {
        "timestamp": "[0:19 - 0:22]",
        "title": "Beginning Animation",
        "text": "But here's where it gets interesting. What happens when we bring the second point closer to the first?"
    },
    {
        "timestamp": "[0:23 - 0:30]",
        "title": "Points Getting Closer",
        "text": "Watch carefully. As the distance between the points shrinks, the secant line begins to rotate. It's approaching something special."
    },
    {
        "timestamp": "[0:31 - 0:35]",
        "title": "Tangent Line Appears",
        "text": "There! When the distance becomes infinitesimally small, the secant line becomes a tangent line. This represents the instantaneous rate of change at that exact point."
    },
    {
        "timestamp": "[0:36 - 0:42]",
        "title": "Derivative Formula",
        "text": "This process of taking the limit as delta x approaches zero is the formal definition of the derivative. It's written as f prime of x equals the limit of the difference quotient."
    },
    {
        "timestamp": "[0:43 - 0:48]",
        "title": "Specific Example",
        "text": "For our function, x squared, the derivative is 2x. At x equals 1, the slope of the tangent line is exactly 2."
    },
    {
        "timestamp": "[0:49 - 0:54]",
        "title": "Geometric Interpretation",
        "text": "The derivative tells us how fast our function is changing at any given point. It's the slope of the tangent line at that location."
    },
    {
        "timestamp": "[0:55 - 1:10]",
        "title": "Moving Dot Animation",
        "text": "Now watch as we move along the curve. See how the tangent line changes? At each point, the derivative gives us a different value. Near zero, the curve is flat, so the derivative is small. As we move right, the curve gets steeper, and the derivative increases."
    },
    {
        "timestamp": "[1:11 - 1:16]",
        "title": "Conclusion",
        "text": "This is the power of derivatives: they capture the instantaneous rate of change at every single point on a curve. Understanding this concept opens the door to analyzing motion, optimization, and change itself."
    }
]

def get_full_narration_text():
    """Returns the complete narration as a single text string."""
    return " ".join([segment["text"] for segment in DERIVATIVE_NARRATION])

def get_narration_segments():
    """Returns the narration broken into segments."""
    return DERIVATIVE_NARRATION
