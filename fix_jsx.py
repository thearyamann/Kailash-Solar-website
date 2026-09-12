import re

with open('src/views/BlogPoweringMeerutWithSolar.tsx', 'r') as f:
    content = f.read()

# Replace <P>...</p> with <P>...</P>
content = re.sub(r'<P>(.*?)</p>', r'<P>\1</P>', content, flags=re.DOTALL)

with open('src/views/BlogPoweringMeerutWithSolar.tsx', 'w') as f:
    f.write(content)
