import os,json
d=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(d,f),encoding='utf-8').read()
js=(r('p2.js')+r('p3.js')+r('p4.js')).replace('__LOGO__',r('logo_t.b64')).replace('__MARK__',r('mark_t.b64'))
seed=r('seed.json') if os.path.exists(os.path.join(d,'seed.json')) else 'null'
seed=seed.replace('</','<\\/')
out=r('p1.html')+'\n<script>window.XTECH_SEED='+seed+';</script>\n<script>\n'+r('db-adapter.js')+'\n</script>\n<script>\n'+js+'\n</script>\n'
open(os.path.join(d,'..','xtech-hq.html'),'w',encoding='utf-8').write(out);print('built index.html',len(out))
