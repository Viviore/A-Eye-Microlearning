const case003Data = [
  {
    "id": "v-round-1",
    "isTutorial": true,
    "videoA": "/videos/tutorial/cut_real.mp4",
    "videoB": "/videos/tutorial/cut_ai.mp4",
    "correctPanel": "B",
    "tells": ["Cucumber slice duplicates directly onto the knife blade"],
    "distractorTells": [
      "Knife blade bent out of shape mid-slice",
      "Lighting changed on the cutting board",
      "Hand snapped to a different position without transition"
    ]
  },
  {
    "id": "v-round-2",
    "isTutorial": false,
    "videoA": "/videos/set1/race_real.mp4",
    "videoB": "/videos/set1/race_ai.mp4",
    "correctPanel": "B",
    "tells": ["Background vehicles warp and melt continuously"],
    "distractorTells": [
      "Car reflections were inverted",
      "Tail lights blinked erratically",
      "Street lights vanished suddenly"
    ]
  },
  {
    "id": "v-round-3",
    "isTutorial": false,
    "videoA": "/videos/set1/sushi_real.mp4",
    "videoB": "/videos/set1/sushi_ai.mp4",
    "correctPanel": "B",
    "tells": ["Sushi doesn't react realistically to the open flame"],
    "distractorTells": [
      "Salmon dissolved like liquid plastic",
      "Plate edge warped",
      "Flame color was inconsistent"
    ]
  },
  {
    "id": "v-round-4",
    "isTutorial": false,
    "videoA": "/videos/set3/block_real.mp4",
    "videoB": "/videos/set3/block_ai.mp4",
    "correctPanel": "B",
    "tells": ["Red mushroom magically duplicated"],
    "distractorTells": [
      "UI elements vanished temporarily",
      "Lighting didn't match sun",
      "Player hand motion skipped frames"
    ]
  },
  {
    "id": "v-round-5",
    "isTutorial": false,
    "videoA": "/videos/set4/milk_ai.mp4",
    "videoB": "/videos/set4/milk_real.mp4",
    "correctPanel": "A",
    "tells": ["Milk flowed ignoring actual gravity and collision"],
    "distractorTells": [
      "Glass jar reflection was distorted",
      "Liquid stream broke physics",
      "Blender spout changed shape"
    ]
  },
  {
    "id": "v-round-6",
    "isTutorial": false,
    "videoA": "/videos/set5/soup_real.mp4",
    "videoB": "/videos/set5/soup_ai.mp4",
    "correctPanel": "B",
    "tells": ["Chicken and carrots blended together seamlessly"],
    "distractorTells": [
      "Ladle metal reflection distorted",
      "Pot handles shifted position",
      "Steam motion was frozen"
    ]
  },
  {
    "id": "v-round-7",
    "isTutorial": false,
    "videoA": "/videos/set6/deer_ai.mp4",
    "videoB": "/videos/set6/deer_real.mp4",
    "correctPanel": "A",
    "tells": ["Deer antlers distorted structurally while lifting"],
    "distractorTells": [
      "Leg joints broke and snapped erratically",
      "Background feeder drifted sideways",
      "Grass texture distorted"
    ]
  },
  {
    "id": "v-round-8",
    "isTutorial": false,
    "videoA": "/videos/set7/mario_real.mp4",
    "videoB": "/videos/set7/mario_ai.mp4",
    "correctPanel": "B",
    "tells": ["HUD interface and speedometer digits scrambled dynamically"],
    "distractorTells": [
      "Kart tires clipped through track",
      "Rainbow texture tore and fragmented",
      "Shadows didn't match light source"
    ]
  },
  {
    "id": "v-round-9",
    "isTutorial": false,
    "videoA": "/videos/set8/flower_ai.mp4",
    "videoB": "/videos/set8/flower_real.mp4",
    "correctPanel": "A",
    "tells": ["Petals and stamens morphing"],
    "distractorTells": [
      "Stem position shifted abruptly",
      "Background lighting strobed randomly",
      "Shadows didn't match light source"
    ]
  },
  {
    "id": "v-round-10",
    "isTutorial": false,
    "videoA": "/videos/set9/orange_real.mp4",
    "videoB": "/videos/set9/orange_ai.mp4",
    "correctPanel": "B",
    "tells": ["An orange disappeared completely"],
    "distractorTells": [
      "Water ripples froze mid-air",
      "Air bubbles popped out of existence without surfacing",
      "Lighting shifted color"
    ]
  },
  {
    "id": "v-round-11",
    "isTutorial": false,
    "videoA": "/videos/set10/cake_ai.mp4",
    "videoB": "/videos/set10/cake_real.mp4",
    "correctPanel": "A",
    "tells": ["Frosting physics don't match reality"],
    "distractorTells": [
      "Piping tip drifted off-center",
      "Cake board shifted position",
      "Shadows didn't match light source"
    ]
  },
  {
    "id": "v-round-12",
    "isTutorial": false,
    "videoA": "/videos/set11/roblox_real.mp4",
    "videoB": "/videos/set11/roblox_ai.mp4",
    "correctPanel": "B",
    "tells": ["Path platforms warped and shifted unnaturally"],
    "distractorTells": [
      "Player avatar limbs stretched like rubber",
      "UI elements flickered",
      "Background floating island distorted"
    ]
  },
  {
    "id": "v-round-13",
    "isTutorial": false,
    "videoA": "/videos/set12/cat_ai.mp4",
    "videoB": "/videos/set12/cat_real.mp4",
    "correctPanel": "A",
    "tells": ["Kitten's actions is unnatural"],
    "distractorTells": [
      "Bed sheet pattern shifted constantly",
      "Lighting pulsed randomly without a source",
      "Background blurred unevenly"
    ]
  },
  {
    "id": "v-round-14",
    "isTutorial": false,
    "videoA": "/videos/set13/bird_real.mp4",
    "videoB": "/videos/set13/bird_ai.mp4",
    "correctPanel": "B",
    "tells": ["Parrot beaks didn't make physical contact while feeding"],
    "distractorTells": [
      "Feather texture blurred",
      "Branch shape shifted",
      "Background illumination strobed erratically"
    ]
  },
  {
    "id": "v-round-15",
    "isTutorial": false,
    "videoA": "/videos/set14/pop_ai.mp4",
    "videoB": "/videos/set14/pop_real.mp4",
    "correctPanel": "A",
    "tells": ["Balloon popped without any actual rubber tearing or fragments"],
    "distractorTells": [
      "Pool water surface froze completely",
      "Fingers stretched and distorted upon popping",
      "Background trees shifted position"
    ]
  },
  {
    "id": "v-round-16",
    "isTutorial": false,
    "videoA": "/videos/set15/eat_real.mp4",
    "videoB": "/videos/set15/eat_ai.mp4",
    "correctPanel": "B",
    "tells": ["Food phased directly through the jaw instead of being chewed"],
    "distractorTells": [
      "Facial features warped while chewing",
      "Shirt neckline changed shape",
      "Background depth of field shifted erratically"
    ]
  },
  {
    "id": "v-round-17",
    "isTutorial": false,
    "videoA": "/videos/set16/pixel_ai.mp4",
    "videoB": "/videos/set16/pixel_real.mp4",
    "correctPanel": "A",
    "tells": ["Water surface animated with inconsistent, non-grid physics"],
    "distractorTells": [
      "Character outline flickered",
      "Wooden dock tiles misaligned suddenly",
      "Lily pad size changed unexpectedly"
    ]
  },
  {
    "id": "v-round-18",
    "isTutorial": false,
    "videoA": "/videos/set17/salad_real.mp4",
    "videoB": "/videos/set17/salad_ai.mp4",
    "correctPanel": "B",
    "tells": ["Salad greens ignored gravity and mass during mixing"],
    "distractorTells": [
      "Bowl outline flickered",
      "Table texture shifted",
      "Background lighting changed"
    ]
  },
  {
    "id": "v-round-19",
    "isTutorial": false,
    "videoA": "/videos/set18/chop_ai.mp4",
    "videoB": "/videos/set18/chop_real.mp4",
    "correctPanel": "A",
    "tells": ["Cabbage pieces phased directly through the cutting board"],
    "distractorTells": [
      "Cutting board shifted position",
      "Fingers snapped to new positions instantly",
      "Kitchen appliances in the back shifted shapes"
    ]
  },
  {
    "id": "v-round-20",
    "isTutorial": false,
    "videoA": "/videos/set19/slime_real.mp4",
    "videoB": "/videos/set19/slime_ai.mp4",
    "correctPanel": "B",
    "tells": ["Slime and fingers fused into a single continuous texture"],
    "distractorTells": [
      "Table edge shifted position",
      "Sleeve cuff changed shape",
      "Background wall color shifted"
    ]
  },
  {
    "id": "v-round-21",
    "isTutorial": false,
    "videoA": "/videos/set20/ball_ai.mp4",
    "videoB": "/videos/set20/ball_real.mp4",
    "correctPanel": "A",
    "tells": ["Knife sliced without creating any physical resistance or indent"],
    "distractorTells": [
      "Sand ball texture flickered",
      "Tray surface shifted position",
      "Hand fingers warped"
    ]
  }
]

export default case003Data;