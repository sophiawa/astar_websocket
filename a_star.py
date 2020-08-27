

def h(node, dest):
  x, y = node
  destx, desty = dest
  dx = abs(destx - x)
  dy = abs(desty - y)
  return dx + dy


def get_min_f_node(open_set, f_scores):
  min_f = 100000
  for node in open_set:
    f = f_scores[node]
    if f < min_f:
      min_f = f
      min_node = node
  return min_node


def check_obst_corners_touch(x, y, dir, obstacles):
  coords = []
  if dir == "right" or dir == "left":
    for obst1 in obstacles:
      for obst2 in obstacles:
        if obst1 != obst2 and obst1["start_x"] == obst2["end_x"] and ((obst1["start_y"] == obst2["end_y"] and y == obst1["start_y"]) or (obst1["end_y"] == obst2["start_y"] and y == obst1["end_y"])):
          coords += [ obst1["start_x"] ]
        if obst1 != obst2 and obst1["end_x"] == obst2["start_x"] and ((obst1["start_y"] == obst2["end_y"] and y == obst1["start_y"]) or (obst1["end_y"] == obst2["start_y"] and y == obst1["end_y"])):
          coords += [ obst1["end_x"] ]
    return coords

  if dir == "up" or dir == "down":
    for obst1 in obstacles:
      for obst2 in obstacles:
        if obst1 != obst2 and obst1["start_y"] == obst2["end_y"] and ((obst1["start_x"] == obst2["end_x"] and x == obst1["start_x"]) or (obst1["end_x"] == obst2["start_x"] and x == obst1["end_x"])):
          coords += [ obst1["start_y"] ]
        if obst1 != obst2 and obst1["end_y"] == obst2["start_y"] and ((obst1["start_x"] == obst2["end_x"] and x == obst1["start_x"]) or (obst1["end_x"] == obst2["start_x"] and x == obst1["end_x"])):
          coords += [ obst1["end_y"] ]
    return coords
  return coords
        


def check_obstacle(x, y, dir, obstacles):
  obst_coords = []
  up_bound = False
  low_bound = False
  left_bound = False
  right_bound = False
  low = []
  up = []
  if dir == "right":
    for obst in obstacles:
      if obst["start_y"] < y and y < obst["end_y"] and x <= obst["start_x"]:
        obst_coords += [ obst["start_x"] ]
      if obst["start_y"] == y and x < obst["end_x"]:
        low_bound = True
        low += [ obst["start_x"] ]
      if obst["end_y"] == y and x < obst["end_x"]:
        up_bound = True
        up += [ obst["start_x"] ]
    if low_bound and up_bound:
      obst_coords += [ max(max(low), max(up)) ]
    if len(obst_coords) > 0:
      obst_coords += check_obst_corners_touch(x, y, dir, obstacles)
      return (True, (min(obst_coords), y))
  
  elif dir == "left":
    for obst in obstacles:
      if obst["start_y"] < y and y < obst["end_y"] and obst["end_x"] <= x:
        obst_coords += [ obst["end_x"] ]
      if obst["start_y"] == y and obst["start_x"] < x:
        low_bound = True
        low += [ obst["end_x"] ]
      if obst["end_y"] == y and obst["start_x"] < x:
        up_bound = True
        up += [ obst["end_x"] ]
    if low_bound and up_bound:
      obst_coords += [ min(min(low), min(up)) ]
    if len(obst_coords) > 0:
      obst_coords += check_obst_corners_touch(x, y, dir, obstacles)
      return (True, (max(obst_coords), y))

  elif dir == "up":
    for obst in obstacles:
      if obst["start_x"] < x and x < obst["end_x"] and y <= obst["start_y"]:
        obst_coords += [ obst["start_y"] ]
      if obst["start_x"] == x and y < obst["end_y"]:
        low_bound = True
        low += [ obst["start_y"] ]
      if obst["end_x"] == x and y < obst["end_y"]:
        up_bound = True
        up += [ obst["start_y"] ]
    if low_bound and up_bound:
      obst_coords += [ max(min(low), min(up)) ]
    if len(obst_coords) > 0:
      obst_coords += check_obst_corners_touch(x, y, dir, obstacles)
      return (True, (x, min(obst_coords)))

  elif dir == "down":
    for obst in obstacles:
      if obst["start_x"] < x and x < obst["end_x"] and y >= obst["end_y"]:
        obst_coords += [ obst["end_y"] ]
      if obst["start_x"] == x and y > obst["start_y"]:
        right_bound = True
        low += [ obst["end_y"] ]
      if obst["end_x"] == x and y > obst["start_y"]:
        left_bound = True
        up += [ obst["end_y"] ]
    if left_bound and right_bound:
      obst_coords += [ min(max(low), max(up)) ]
    if len(obst_coords) > 0:
      obst_coords += check_obst_corners_touch(x, y, dir, obstacles)
      return (True, (x, max(obst_coords)))

  return (False, -1)



def get_neighbors(node, data):
  x, y = node
  destx, desty = data["dest"]
  obstacles = data["obstacles"]
  neighbors = []
  
  # Right neighbor
  (is_obstacle_in_path, obstacle_coord) = check_obstacle(x, y, "right", obstacles)
  if is_obstacle_in_path:
    obstx, obsty = obstacle_coord
    if destx <= x:
      neighbors += [ (min(x+1, obstx), y) ]
    else:
      neighbors += [ (min(destx,obstx), y) ]
  else:
    if destx <= x:
      neighbors += [(x+1, y)]
    else: 
      neighbors += [ (destx, y) ]

  # Left neighbor
  (is_obstacle_in_path, obstacle_coord) = check_obstacle(x, y, "left", obstacles)
  if is_obstacle_in_path:
    obstx, obsty = obstacle_coord
    if destx >= x:
      neighbors += [ (max(x-1, obstx), y) ]
    else:
      neighbors += [ (max(destx,obstx), y) ]
  else:
    if destx >= x:
      neighbors += [(x-1, y)]
    else: 
      neighbors += [ (destx, y) ]

  # Up neighbor
  (is_obstacle_in_path, obstacle_coord) = check_obstacle(x, y, "up", obstacles)
  if is_obstacle_in_path:
    obstx, obsty = obstacle_coord
    if desty <= y:
      neighbors += [ (x, min(y+1, obsty)) ]
    else:
      neighbors += [ (x, min(desty, obsty)) ]
  else:
    if desty <= y:
      neighbors += [(x, y+1)]
    else: 
      neighbors += [ (x, desty) ]

  # Down neighbor
  (is_obstacle_in_path, obstacle_coord) = check_obstacle(x, y, "down", obstacles)
  if is_obstacle_in_path:
    obstx, obsty = obstacle_coord
    if desty >= y:
      neighbors += [ (x, max(y-1, obsty)) ]
    else:
      neighbors += [ (x, max(desty,obsty)) ]
  else:
    if desty >= y:
      neighbors += [(x, y-1)]
    else: 
      neighbors += [ (x, desty) ]

  #print("Node: ", node)
  #print("Neighbors: ", neighbors, "\n")
  return neighbors


def get_dist(current, neighbor):
  currx, curry = current
  neighx, neighy = neighbor
  if currx == neighx:
    return abs(curry - neighy)
  # curry == neighy:
  return abs(currx - neighx)


def reconstruct_path(came_from, current):
  total_path = [ current ]
  while current in came_from:
    current = came_from[current]
    total_path += [ current ]
  list.reverse(total_path)
  return total_path


def add_walls(data):
  limit = data["limit"]
  obstacles = data["obstacles"]
  left = { "start_x" : -1, "start_y" : -1, "end_x" : 0, "end_y" : limit + 1 }
  right = { "start_x" : limit, "start_y" : -1, "end_x" : limit + 1, "end_y" : limit + 1 }
  up = { "start_x" : 0, "start_y" : limit, "end_x" : limit, "end_y" : limit + 1 }
  down = { "start_x" : 0, "start_y" : -1, "end_x" : limit, "end_y" : 0 }
  obstacles += [ left, right, up, down ]
  return obstacles



def a_star(data):
  start = data ["source"]
  dest = data ["dest"]
  data["obstacles"] = add_walls(data)

  open_set = { start }
  came_from = dict()
  g_scores = { start : 0 }
  f_scores = { start : h(start, dest) }

  while len(open_set) != 0 and len(open_set) < 200:
    current = get_min_f_node(open_set, f_scores)

    if current == dest:
      return reconstruct_path(came_from, current)
    
    open_set.remove(current)
    neighbors = get_neighbors(current, data)
    for neighbor in neighbors:
      tentative_g = g_scores[current] + get_dist(current, neighbor)
      if neighbor not in g_scores or tentative_g < g_scores[neighbor]:
        came_from[neighbor] = current
        g_scores[neighbor] = tentative_g
        f_scores[neighbor] = tentative_g + h(neighbor, dest)
        if neighbor not in open_set:
          open_set.add(neighbor)
  
  return False

def create_tupled_data(data):
  source = data["source"]
  dest = data["dest"]
  data["source"] = (source[0], source[1])
  data["dest"] = (dest[0], dest[1])
  return data
        
      

def test():
  print("Testing...")

  
  obstacle1 = { "start_x" : 1, "start_y" : 1, "end_x" : 2, "end_y" : 2 }
  obstacle2 = { "start_x" : 3, "start_y" : 3, "end_x" : 4, "end_y" : 4 }
  data1 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [obstacle1, obstacle2], "limit" : 5 }

  assert(a_star(data1) == [(0, 0), (0, 5), (5, 5)])


  obstacle1 = { "start_x" : 1, "start_y" : -1, "end_x" : 3, "end_y" : 3 }
  data2 = { "source" : (0,2), "dest" : (4,0), "obstacles" : [obstacle1], "limit" : 5 }

  assert(a_star(data2) == [(0, 2), (1, 2), (1, 3), (4, 3), (4, 0)])


  data3 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [], "limit" : 5 }

  assert(a_star(data3) == [(0, 0), (0, 5), (5, 5)])
  
  
  obst1 = { "start_x" : 3, "start_y" : 3, "end_x" : 4, "end_y" : 7 }
  obst2 = { "start_x" : 6, "start_y" : 3, "end_x" : 7, "end_y" : 7 }
  obst3 = { "start_x" : 4, "start_y" : 3, "end_x" : 6, "end_y" : 4 }
  obst4 = { "start_x" : 4, "start_y" : 6, "end_x" : 6, "end_y" : 7 }
  data4 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [obst1, obst2, obst3, obst4], "limit" : 5 }
  
  assert(a_star(data4) == False)

  
  data5 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [obst1, obst3, obst4], "limit" : 5 }

  assert(a_star(data5) == [(0, 0), (5, 0), (5, 3), (6, 3), (6, 5), (5, 5)])


  data6 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [obst1, obst2, obst3], "limit" : 5 }

  assert(a_star(data6) == [(0, 0), (0, 5), (0, 6), (0, 7), (5, 7), (5, 5)])

  data7 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [obst1, obst2, obst4], "limit" : 5 }

  assert(a_star(data7) == [(0, 0), (5, 0), (5, 5)])


  data8 = { "source" : (0,0), "dest" : (5,5), "obstacles" : [obst2, obst3, obst4], "limit" : 5 }

  assert(a_star(data8) == [(0, 0), (0, 5), (5, 5)])

  
  data9 = { "source" : (5,5), "dest" : (0,0), "obstacles" : [obst1, obst2, obst3, obst4], "limit" : 5 }
  
  assert(a_star(data9) == False)


  obst1 = { "start_x" : 0, "start_y" : 0, "end_x" : 1, "end_y" : 4 }
  obst2 = { "start_x" : 1, "start_y" : 0, "end_x" : 5, "end_y" : 1 }
  obst3 = { "start_x" : 5, "start_y" : 0, "end_x" : 6, "end_y" : 5 }
  obst4 = { "start_x" : 3, "start_y" : 4, "end_x" : 5, "end_y" : 5 }
  obst5 = { "start_x" : 2, "start_y" : 2, "end_x" : 3, "end_y" : 5 }
  data10 = { "source" : (7,1), "dest" : (4,3), "obstacles" : [obst1, obst2, obst3, obst4, obst5], "limit" : 5 }
  
  assert(a_star(data10) == 
  [(7, 1), (7, 3), (7, 4), (7, 5), (4, 5), (3, 5), (2, 5), (2, 3), (2, 2), (4, 2), (4, 3)])


  data11 = { "source" : (4,3), "dest" : (7,1), "obstacles" : [obst1, obst2, obst3, obst4, obst5], "limit" : 5 }

  print(a_star(data11))
  


  print("Finished!")


    





























