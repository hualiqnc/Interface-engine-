export const EXAMPLE_QUERIES = [
    {
        name: "Simple Inference",
        content: `TELL
  p2=> p3; p3 => p1; c => e; b&e => f; f&g => h; p2&p1&p3 =>d; p1&p3 => c; a; b; p2;
  
  ASK
  d`
    },
    {
        name: "Complex Chain",
        content: `TELL
  p1 => p2; p2 => p3; p3 => p4; p4 => p5; p1;
  
  ASK
  p5`
    }
]