import websockets
import asyncio
import json
import a_star

async def test(ws, path):
  print("server1")
  msg = await ws.recv()
  data = json.loads(msg)
  solution = a_star.a_star(a_star.create_tupled_data(data))
  print("Solution: ", solution)
  solution_msg = json.dumps({"soln" : solution})
  await ws.send(solution_msg)

server = websockets.serve(test, "localhost", 8000)

'''
async def test1(message, host, port):
  print("server\n")
  return websockets.serve(test, "localhost", 8000)
'''

loop=asyncio.get_event_loop()
loop.run_until_complete(server)
loop.run_forever()