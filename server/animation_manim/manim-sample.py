from manim import *

class DerivativeExplanation(Scene):
    def construct(self):
        # Title - [0:00 - 0:03] (3 seconds)
        title = Text("Understanding Derivatives", font_size=48)
        self.play(Write(title), run_time=1.5)
        self.wait(1.5)
        self.play(title.animate.to_edge(UP))
        
        # Create axes
        axes = Axes(
            x_range=[-1, 4, 1],
            y_range=[-1, 9, 1],
            x_length=7,
            y_length=5,
            axis_config={"include_tip": True, "numbers_to_include": range(0, 5)},
        ).shift(DOWN * 0.5)
        
        axes_labels = axes.get_axis_labels(x_label="x", y_label="f(x)")
        
        # Define the function
        def func(x):
            return x**2
        
        graph = axes.plot(func, color=BLUE, x_range=[0, 3])
        graph_label = MathTex("f(x) = x^2", color=BLUE).next_to(graph, UP).shift(LEFT)
        
        # [0:04 - 0:08] Axes and Graph (4 seconds)
        self.play(Create(axes), Write(axes_labels), run_time=2)
        self.play(Create(graph), Write(graph_label), run_time=1.5)
        self.wait(0.5)
        
        # [0:09 - 0:13] Secant Line Introduction (4 seconds)
        secant_text = Text("Secant Line: Average Rate of Change", font_size=30).to_edge(DOWN)
        self.play(Write(secant_text), run_time=1.5)
        self.wait(2.5)
        
        # Initial points
        x1 = 1
        x2 = 2.5
        
        dot1 = Dot(axes.c2p(x1, func(x1)), color=YELLOW)
        dot2 = Dot(axes.c2p(x2, func(x2)), color=YELLOW)
        
        # Secant line
        secant = Line(
            axes.c2p(x1, func(x1)),
            axes.c2p(x2, func(x2)),
            color=GREEN
        )
        
        # [0:14 - 0:18] Two Points and Secant (4 seconds)
        self.play(Create(dot1), Create(dot2), run_time=1)
        self.play(Create(secant), run_time=1)
        self.wait(2)
        
        # Show the slope calculation
        slope_text = MathTex(
            r"\text{Slope} = \frac{\Delta y}{\Delta x} = \frac{f(x_2) - f(x_1)}{x_2 - x_1}",
            font_size=32
        ).to_edge(DOWN)
        
        self.play(Transform(secant_text, slope_text), run_time=1.5)
        self.wait(0.5)
        
        # [0:19 - 0:22] Beginning Animation (3 seconds)
        approach_text = Text("As Δx → 0...", font_size=30).to_edge(DOWN)
        self.play(Transform(secant_text, approach_text), run_time=1)
        self.wait(2)
        
        # [0:23 - 0:30] Points Getting Closer (7 seconds)
        for new_x2 in [2.2, 1.8, 1.5, 1.3, 1.15]:
            new_dot2 = Dot(axes.c2p(new_x2, func(new_x2)), color=YELLOW)
            new_secant = Line(
                axes.c2p(x1, func(x1)),
                axes.c2p(new_x2, func(new_x2)),
                color=GREEN
            )
            self.play(
                Transform(dot2, new_dot2),
                Transform(secant, new_secant),
                run_time=0.8
            )
            self.wait(0.6)
        
        # [0:31 - 0:35] Tangent Line Appears (4 seconds)
        tangent_text = Text("Tangent Line: Instantaneous Rate of Change", font_size=30, color=RED).to_edge(DOWN)
        self.play(Transform(secant_text, tangent_text), run_time=1.5)
        self.wait(2.5)
        
        # Calculate tangent slope at x=1 (derivative of x^2 is 2x, so at x=1, slope=2)
        slope_at_1 = 2 * x1
        tangent_length = 1.5
        tangent = Line(
            axes.c2p(x1 - tangent_length/2, func(x1) - slope_at_1 * tangent_length/2),
            axes.c2p(x1 + tangent_length/2, func(x1) + slope_at_1 * tangent_length/2),
            color=RED
        )
        
        self.play(
            Transform(secant, tangent),
            FadeOut(dot2),
            run_time=1
        )
        self.wait(0.5)
        
        # [0:36 - 0:42] Derivative Formula (6 seconds)
        derivative_formula = MathTex(
            r"f'(x) = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}",
            font_size=36
        ).to_edge(DOWN)
        
        self.play(Transform(secant_text, derivative_formula), run_time=2)
        self.wait(4)
        
        # [0:43 - 0:48] Specific Example (5 seconds)
        specific_derivative = MathTex(
            r"f'(x) = 2x",
            r"\quad \text{so} \quad f'(1) = 2",
            font_size=36,
            color=YELLOW
        ).next_to(derivative_formula, UP)
        
        self.play(Write(specific_derivative), run_time=1.5)
        self.wait(3.5)
        
        # [0:49 - 0:54] Geometric Interpretation (5 seconds)
        self.play(
            FadeOut(secant_text),
            FadeOut(specific_derivative),
            run_time=1
        )
        
        meaning_text = Text(
            "The derivative measures how fast f(x) is changing at each point",
            font_size=28
        ).to_edge(DOWN)
        
        self.play(Write(meaning_text), run_time=1.5)
        self.wait(2.5)
        
        # [0:55 - 1:10] Moving Dot Animation (15 seconds)
        moving_dot = Dot(axes.c2p(0.5, func(0.5)), color=YELLOW)
        self.play(ReplacementTransform(dot1, moving_dot), run_time=1)
        
        def get_tangent_line(x_val):
            slope = 2 * x_val  # derivative of x^2
            length = 1.2
            return Line(
                axes.c2p(x_val - length/2, func(x_val) - slope * length/2),
                axes.c2p(x_val + length/2, func(x_val) + slope * length/2),
                color=RED
            )
        
        # Animate tangent moving with the point
        self.play(FadeOut(secant))
        moving_tangent = get_tangent_line(0.5)
        self.play(Create(moving_tangent))
        
        # Slow down the moving dot to take 13 seconds (15s - 2s for setup)
        for x_val in np.linspace(0.5, 2.5, 50):
            new_dot = Dot(axes.c2p(x_val, func(x_val)), color=YELLOW)
            new_tangent = get_tangent_line(x_val)
            self.play(
                Transform(moving_dot, new_dot),
                Transform(moving_tangent, new_tangent),
                run_time=0.26,  # 50 steps * 0.26 = 13 seconds
                rate_func=linear
            )
        
        # [1:11 - 1:18] Conclusion (7 seconds) - extended to match narration + audio buffer
        self.wait(7)