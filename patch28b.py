base = r'C:\Users\awright\Desktop\Видео Клод'
p = base + r'\scripts\main28_body.jsx'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a
    s = s.replace(a, b, 1)


# замок: портретный вырез, контур
rep("left: 560, top: 960, width: 230, zIndex: 38,", "left: 640, top: 920, width: 170, zIndex: 38,")
rep("filter: 'drop-shadow(0 16px 18px rgba(40,30,20,0.45))'}} />; })()}", "filter: 'drop-shadow(0 0 2px rgba(40,30,50,0.9)) drop-shadow(0 16px 18px rgba(40,30,20,0.45))'}} />; })()}")
# B: чипы Париж
rep('<Chip txt="Париж" at={7.48} t={t} x={80} y={1090} size={44} />\n            <Chip txt="всемирная выставка" at={7.7} t={t} x={110} y={1190} size={28} bg="rgba(255,236,170,0.98)" rot={2} />',
    '<Chip txt="Париж, всемирная выставка" at={7.48} t={t} x={70} y={1075} size={32} bg="rgba(255,236,170,0.98)" rot={-1} />')
# шторы на гобелене: двигаем внутреннюю штору, обёртка неподвижна
rep("zIndex: 39, transform: `translateX(${(q - 1) * 303}px) rotate(2deg)`}}><Curtain w={303} h={268} /></div>",
    "zIndex: 39, transform: 'rotate(2deg)'}}><Curtain w={303} h={268} style={{transform: `translateX(${(q - 1) * 303}px)`}} /></div>")
rep("zIndex: 39, transform: `translateX(${(1 - q) * 303}px) rotate(2deg)`}}><Curtain w={303} h={268} /></div>",
    "zIndex: 39, transform: 'rotate(2deg)'}}><Curtain w={303} h={268} style={{transform: `translateX(${(1 - q) * 303}px)`}} /></div>")
rep('<Chip txt="речь о войне в Ираке" at={24.3} t={t} x={330} y={1330}', '<Chip txt="речь о войне в Ираке" at={24.3} t={t} x={400} y={1330}')
open(p, 'w', encoding='utf-8').write(s)
print('ok')
