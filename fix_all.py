import re

with open('src/views/BlogPoweringMeerutWithSolar.tsx', 'r') as f:
    content = f.read()

# Fix Button and DialogTrigger
content = content.replace('''    <DialogTrigger asChild>
      <Button className={`font-bold transition-transform active:scale-95 ${className}`}>
        {text}
  );''', '''    <DialogTrigger asChild>
      <Button className={`font-bold transition-transform active:scale-95 ${className}`}>
        {text}
      </Button>
    </DialogTrigger>
  );''')

# Fix <P> tags
content = re.sub(r'<P>(.*?)</p>', r'<P>\1</P>', content, flags=re.DOTALL)

with open('src/views/BlogPoweringMeerutWithSolar.tsx', 'w') as f:
    f.write(content)
