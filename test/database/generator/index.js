/*
DELETE FROM users WHERE id != 1;
ALTER TABLE users AUTO_INCREMENT = 1;

DELETE FROM clients;
DELETE FROM client_interactions_history;
ALTER TABLE clients AUTO_INCREMENT = 1;
ALTER TABLE client_contacts AUTO_INCREMENT = 1;
ALTER TABLE client_addresses AUTO_INCREMENT = 1;
ALTER TABLE client_interactions_history AUTO_INCREMENT = 1;

DELETE FROM equipment_types;
DELETE FROM equipment_models;
DELETE FROM equipment_brands;
ALTER TABLE equipment_types AUTO_INCREMENT = 1;
ALTER TABLE equipment_models AUTO_INCREMENT = 1;
ALTER TABLE equipment_brands AUTO_INCREMENT = 1;

DELETE FROM equipments;
DELETE FROM equipment_interactions_history;
ALTER TABLE equipments AUTO_INCREMENT = 1;
ALTER TABLE equipment_interactions_history AUTO_INCREMENT = 1;

DELETE FROM repair_entry_accessories_options;
DELETE FROM repair_entry_reported_issues_options;
DELETE FROM repair_intervention_works_done_options;
DELETE FROM repair_intervention_accessories_used_options;
DELETE FROM repair_status;
ALTER TABLE repair_entry_accessories_options AUTO_INCREMENT = 1;
ALTER TABLE repair_entry_reported_issues_options AUTO_INCREMENT = 1;
ALTER TABLE repair_intervention_works_done_options AUTO_INCREMENT = 1;
ALTER TABLE repair_intervention_accessories_used_options AUTO_INCREMENT = 1;
ALTER TABLE repair_status AUTO_INCREMENT = 1;

DELETE FROM repair_entry_accessories;
DELETE FROM repair_entry_reported_issues;
DELETE FROM repair_intervention_works_done;
DELETE FROM repair_intervention_accessories_used;
DELETE FROM repairs;
DELETE FROM repair_interactions_history;
ALTER TABLE repair_entry_accessories AUTO_INCREMENT = 1;
ALTER TABLE repair_entry_reported_issues AUTO_INCREMENT = 1;
ALTER TABLE repair_intervention_works_done AUTO_INCREMENT = 1;
ALTER TABLE repair_intervention_accessories_used AUTO_INCREMENT = 1;
ALTER TABLE repairs AUTO_INCREMENT = 1;
ALTER TABLE repair_interactions_history AUTO_INCREMENT = 1;

DELETE FROM emails;
ALTER TABLE emails AUTO_INCREMENT = 1;

DELETE FROM smses;
ALTER TABLE smses AUTO_INCREMENT = 1;
*/

const mysql = require("mysql2")

const pool = mysql.createPool({
  uri: "mysql://root:@localhost:3306/mxt",
  timezone: "+00:00"
})

const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query("SET time_zone = '+00:00'", (error) => {
          if (error) {
            connection.release()
            reject(error)
          } else {
            resolve(connection)
          }
        })
      }
    })
  })
}

const dbQueryExecutor = {
  execute: (query, values, conn) => {
    return new Promise((resolve, reject) => {
      ;(conn ? Promise.resolve(conn) : getConnection())
        .then((connection) => {
          connection.query(query, values, (error, results) => {
            if (error) {
              reject(error)
            } else {
              resolve(results)
            }
            if (!conn) {
              connection.release()
            }
          })
        })
        .catch(reject)
    })
  }
}

const bcrypt = require("bcrypt")

const { fakerPT_PT: faker } = require("@faker-js/faker")

function generateRandomCreationDate(startDate, endDate) {
  const startTimestamp = startDate.getTime()
  const endTimestamp = endDate.getTime()

  const randomTimestamp = Math.random() * (endTimestamp - startTimestamp) + startTimestamp

  return new Date(randomTimestamp)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//Funcionários
async function isUsernameUnique(username) {
  const query = `
    SELECT COUNT(*) AS count FROM users WHERE username = ?;
  `
  const results = await dbQueryExecutor.execute(query, [username])
  return results[0].count === 0
}

async function generateUniqueUsername() {
  let username = faker.internet.userName()
  let isUnique = await isUsernameUnique(username)

  while (!isUnique) {
    username = faker.internet.userName()
    isUnique = await isUsernameUnique(username)
  }

  return username
}

async function isEmailUnique(email) {
  const query = `
    SELECT COUNT(*) AS count FROM users WHERE email = ?;
  `
  const results = await dbQueryExecutor.execute(query, [email])
  return results[0].count === 0
}

async function generateUniqueEmail() {
  let email = faker.internet.email()
  let isUnique = await isEmailUnique(email)

  while (!isUnique) {
    email = faker.internet.email()
    isUnique = await isEmailUnique(email)
  }

  return email
}

async function createUser(startDate, endDate) {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash("123123", saltRounds)

  const username = await generateUniqueUsername()
  const email = await generateUniqueEmail()
  const role = Math.random() > 0.3 ? "Administrador" : "Funcionário"
  const isActive = true
  const createdByUserId = 1

  const createdAt = generateRandomCreationDate(startDate, endDate)

  const userQuery = `
    INSERT INTO users (username, password, email, role, is_active, created_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `

  const userValues = [username, passwordHash, email, role, isActive, createdByUserId, createdAt]

  const userResult = await dbQueryExecutor.execute(userQuery, userValues)
  const userId = userResult.insertId
  await createEmployee(userId)
  return createdAt
}

async function createEmployee(userId) {
  const name = faker.person.fullName()
  const phoneNumber = faker.phone.number()
  const country = faker.location.country()
  const city = faker.location.city()
  const locality = faker.location.state()
  const address = faker.location.streetAddress()
  const postalCode = faker.location.zipCode()
  const description = faker.lorem.paragraph()

  const employeeQuery = `
    INSERT INTO employees (user_id, name, phone_number, country, city, locality, address, postal_code, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `

  const employeeValues = [
    userId,
    name,
    phoneNumber,
    country,
    city,
    locality,
    address,
    postalCode,
    description
  ]

  await dbQueryExecutor.execute(employeeQuery, employeeValues)
}

async function createUsers(numUsers, startDate, endDate) {
  for (let i = 0; i < numUsers; i++) {
    await createUser(startDate, endDate)
  }
}

//Clientes
async function createClient(startDate, endDate) {
  const maxAttempts = 50
  let createdAt
  let createdByUserId = null

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    createdAt = generateRandomCreationDate(startDate, endDate)
    createdByUserId = await getRandomValidUserId(createdAt)

    if (createdByUserId) {
      break
    }

    startDate = createdAt
  }

  if (!createdByUserId) {
    throw new Error("No valid user found for the creation date after several attempts.")
  }

  const clientQuery = `
    INSERT INTO clients (name, description, created_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?);
  `

  const name = faker.person.fullName()
  const description = `<p>${faker.lorem.paragraph()}</p>`

  const clientValues = [name, description, createdByUserId, createdAt]

  const clientResult = await dbQueryExecutor.execute(clientQuery, clientValues)
  const clientId = clientResult.insertId

  const numContacts = getRandomInt(0, 6)
  for (let i = 0; i < numContacts; i++) {
    await createClientContact(clientId, createdByUserId, createdAt)
  }

  const numAddresses = getRandomInt(0, 6)
  for (let i = 0; i < numAddresses; i++) {
    await createClientAddress(clientId, createdByUserId, createdAt)
  }

  const changes = [
    { field: "Nome", after: name },
    { field: "Descrição", after: description }
  ]

  const activityHistoryQuery = `
    INSERT INTO client_interactions_history (client_id, type, details, responsible_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?);
  `
  const activityHistoryValues = [
    clientId,
    "Cliente Criado",
    JSON.stringify(changes),
    createdByUserId,
    createdAt
  ]

  await dbQueryExecutor.execute(activityHistoryQuery, activityHistoryValues)

  return createdAt
}

async function createClientContact(clientId, createdByUserId, createdAt) {
  const type = faker.helpers.arrayElement(["E-mail", "Telefone", "Telemóvel", "Outro"])
  let contact

  if (type === "E-mail") {
    contact = faker.internet.email()
  } else if (type === "Telefone" || type === "Telemóvel") {
    contact = faker.phone.number()
  } else {
    contact = faker.helpers.arrayElement([faker.internet.email(), faker.phone.number()])
  }

  const description = faker.lorem.sentence()

  const contactQuery = `
    INSERT INTO client_contacts (client_id, type, contact, description, created_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?, ?);
  `
  const contactValues = [clientId, type, contact, description, createdByUserId, createdAt]
  await dbQueryExecutor.execute(contactQuery, contactValues)
}

async function createClientAddress(clientId, createdByUserId, createdAt) {
  const country = faker.location.country()
  const city = faker.location.city()
  const locality = faker.location.state()
  const address = faker.location.streetAddress()
  const postalCode = faker.location.zipCode()

  const addressQuery = `
    INSERT INTO client_addresses (client_id, country, city, locality, address, postal_code, created_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `
  const addressValues = [
    clientId,
    country,
    city,
    locality,
    address,
    postalCode,
    createdByUserId,
    createdAt
  ]
  await dbQueryExecutor.execute(addressQuery, addressValues)
}

async function createClients(numClients, startDate, endDate) {
  for (let i = 0; i < numClients; i++) {
    await createClient(startDate, endDate)
  }
}

//Equipamentos
const types = [
  "Smartphone",
  "Laptop",
  "Desktop",
  "Tablet",
  "Router",
  "Monitor",
  "Headphone",
  "Printer",
  "Camera",
  "Smartwatch"
]

const brands = [
  "Sony",
  "Samsung",
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "Microsoft",
  "Asus",
  "Acer",
  "LG",
  "Nokia",
  "Motorola",
  "Google",
  "Xiaomi",
  "Huawei",
  "Oppo",
  "OnePlus",
  "Intel",
  "AMD",
  "Cisco",
  "Panasonic",
  "Toshiba",
  "JBL",
  "Bose",
  "Logitech",
  "Razer",
  "Alienware",
  "MSI",
  "Sennheiser",
  "Philips",
  "Kenwood",
  "Garmin",
  "GoPro",
  "Fitbit",
  "Nest"
]

const models = [
  "Xperia 1 II",
  "Xperia 5 II",
  "Xperia 10 II",
  "Alpha 7 III",
  "Alpha 9 II",
  "A8 TV",
  "BRAVIA X90J",
  "WH-1000XM4",
  "Xperia PRO",
  "PS5",

  "Galaxy S21",
  "Galaxy Note 20",
  "Galaxy A52",
  "Galaxy Tab S7",
  "QLED 8K",
  "The Frame",
  "Galaxy Buds Pro",
  "Galaxy Z Fold 3",
  "Galaxy Watch 4",
  "Odyssey G9",

  "iPhone 13",
  "iPhone 13 Pro",
  "iPad Air",
  "MacBook Pro",
  "MacBook Air",
  "Apple Watch Series 7",
  "AirPods Pro",
  "iMac 24-inch",
  "HomePod Mini",
  "Apple TV 4K",

  "XPS 13",
  "Inspiron 15",
  "Alienware X17",
  "Latitude 7420",
  "G5 15",
  "U2720Q Monitor",
  "S2721DGF",
  "Precision 5550",
  "OptiPlex 7080",
  "AW2521H",

  "Spectre x360",
  "Envy 13",
  "Pavilion 27",
  "Omen 15",
  "Elite Dragonfly",
  "DeskJet 3755",
  "LaserJet Pro MFP",
  "HP Reverb G2",
  "ZBook Create",
  "HP EliteBook 840",

  "ThinkPad X1 Carbon",
  "Yoga 9i",
  "Legion 5 Pro",
  "IdeaPad 5",
  "ThinkCentre M90n",
  "Tab P11",
  "ThinkVision P32u",
  "Legion 7i",
  "ThinkPad L15",
  "Yoga Slim 7i",

  "Surface Laptop 4",
  "Surface Pro 7",
  "Surface Book 3",
  "Surface Studio 2",
  "Xbox Series X",
  "Surface Headphones 2",
  "Surface Duo",
  "Surface Go 3",
  "Surface Laptop Studio",
  "Surface Pen",

  "ROG Zephyrus G14",
  "TUF Gaming A15",
  "ZenBook 13",
  "VivoBook 15",
  "ROG Strix Scar 15",
  "ROG Swift PG259QN",
  "ZenBook Flip 14",
  "TUF Dash F15",
  "ROG Phone 5",
  "ROG Maximus XIII Hero",

  "Predator Helios 300",
  "Aspire 5",
  "Swift 3",
  "ConceptD 7",
  "Predator X34",
  "Aspire C27",
  "Nitro 5",
  "Predator Triton 500",
  "Aspire 7",
  "Swift X",

  "LG Velvet",
  "LG Gram 17",
  "LG UltraWide Monitor",
  "LG OLED65CXPUA",
  "LG Wing",
  "LG NanoCell 90 Series",
  "LG 27GL83A-B",
  "LG Tone Free FN7",
  "LG UHD AI ThinQ",
  "LG Styler",

  "Nokia 8.3 5G",
  "Nokia 7.2",
  "Nokia 6.3",
  "Nokia 5.4",
  "Nokia 3.4",
  "Nokia 1.4",
  "Nokia 2.4",
  "Nokia 9 PureView",
  "Nokia 4.2",
  "Nokia 8.1",

  "Moto G Power",
  "Moto G Stylus",
  "Moto Edge 20",
  "Moto Razr 5G",
  "Moto G9 Plus",
  "Moto G8",
  "Moto One Fusion",
  "Moto E7 Plus",
  "Moto Z4",
  "Moto G Fast",

  "Pixel 6",
  "Pixel 6 Pro",
  "Pixel 5",
  "Pixel 4a",
  "Nest Hub Max",
  "Pixel Buds A-Series",
  "Chromecast with Google TV",
  "Nest Doorbell",
  "Pixel Slate",
  "Nest Cam IQ",

  "Mi 11",
  "Redmi Note 10",
  "Mi Mix 4",
  "Redmi K40",
  "Mi Pad 5",
  "Mi Band 6",
  "Redmi 10",
  "Mi 11 Lite",
  "Redmi Note 11 Pro",
  "Mi TV 4S",

  "P50 Pro",
  "Mate 40 Pro",
  "Nova 9",
  "MatePad Pro",
  "P40 Lite",
  "Watch GT 3",
  "MateBook X Pro",
  "P30 Pro",
  "Mate 20 X",
  "Band 6",

  "Find X3 Pro",
  "Reno 6 Pro",
  "A94 5G",
  "F19 Pro+",
  "Find X2",
  "Reno 5 Pro",
  "A74 5G",
  "Find X3 Neo",
  "Reno 4",
  "Oppo Watch",

  "OnePlus 9",
  "OnePlus 9 Pro",
  "OnePlus 8T",
  "OnePlus Nord",
  "OnePlus 8",
  "OnePlus 7T Pro",
  "OnePlus 6T",
  "OnePlus Buds Pro",
  "OnePlus 7T",
  "OnePlus Watch",

  "Core i9-11900K",
  "Core i7-11700K",
  "Core i5-11600K",
  "Core i9-10900K",
  "Xeon W-3375",
  "Core i5-11400",
  "Core i3-10100",
  "Core i9-10980XE",
  "Core i7-10700",
  "Core i5-10500",

  "Ryzen 9 5950X",
  "Ryzen 7 5800X",
  "Ryzen 5 5600X",
  "Ryzen 7 5700G",
  "Ryzen 9 5900X",
  "Ryzen 5 5500",
  "Ryzen 7 5800G",
  "Ryzen Threadripper 3970X",
  "Ryzen 5 5600G",
  "Ryzen 9 3950X",

  "Catalyst 9300",
  "Meraki MX84",
  "Cisco 2901",
  "Catalyst 9400",
  "Aironet 2800",
  "Cisco 4331",
  "Catalyst 9200",
  "Meraki MR84",
  "Cisco 8851",
  "Meraki MS120-24",

  "Lumix GH5",
  "Lumix S5",
  "Panasonic Toughbook 55",
  "Lumix G85",
  "Panasonic UB9000",
  "Lumix GX85",
  "Panasonic PT-RZ970",
  "Lumix TZ90",
  "Panasonic DP-UB820",
  "Lumix S1",

  "Tecra A50",
  "Portégé X30L",
  "Satellite Pro C50",
  "Toughbook CF-33",
  "Satellite Pro L50",
  "Portégé Z30",
  "Tecra Z50",
  "Satellite L50",
  "Portégé X40",
  "Tecra A40",

  "Charge 5",
  "Flip 6",
  "Pulse 4",
  "PartyBox 310",
  "Xtreme 3",
  "Endurance Peak",
  "Go 3",
  "Reflect Mini NC",
  "Quantum 800",
  "Clip 4",

  "QuietComfort 35 II",
  "SoundLink Revolve+",
  "Bose 700",
  "QuietComfort Earbuds",
  "Soundbar 700",
  "Bose Portable Smart Speaker",
  "SoundLink Mini II",
  "QuietComfort 45",
  "Bose Frames",
  "SoundLink Flex",

  "MX Master 3",
  "G Pro X",
  "C920 HD Pro",
  "MX Keys",
  "G502 HERO",
  "Logitech StreamCam",
  "G733 LIGHTSPEED",
  "Z906 Speaker System",
  "MX Anywhere 3",
  "G915 TKL",

  "Razer DeathAdder V2",
  "Razer BlackWidow V3",
  "Razer Kraken V3",
  "Razer Naga X",
  "Razer Basilisk V3",
  "Razer Viper Ultimate",
  "Razer Huntsman Elite",
  "Razer Blade 15",
  "Razer Kishi",
  "Razer Cynosa V2",

  "Alienware x17",
  "Alienware m15 R6",
  "Alienware Aurora R12",
  "Alienware Area-51m",
  "Alienware x15",
  "Alienware AW2521H",
  "Alienware m17 R6",
  "Alienware R10",
  "Alienware 510H",
  "Alienware 15 R6",

  "GE76 Raider",
  "GS66 Stealth",
  "GT76 Titan",
  "Creator 15",
  "Optix MAG272CQR",
  "GP76 Leopard",
  "MEG Z490 GODLIKE",
  "Creator 17",
  "Pulse GL66",
  "Modern 14",

  "Momentum 3",
  "HD 660S",
  "CX 400BT",
  "PXC 550-II",
  "IE 300",
  "HD 450BT",
  "Momentum True Wireless 2",
  "HD 800S",
  "IE 500 PRO",
  "CX 300S",

  "Hue Lightstrip Plus",
  "Brilliance 275E1",
  "Sonicare ProtectiveClean",
  "Philips 55OLED803",
  "Lumea Prestige",
  "Philips 324E5",
  "Series 5000",
  "Philips Airfryer XXL",
  "Philips 24M1",
  "Philips 258B6QJEB",

  "KMX750",
  "Chef Titanium XL",
  "KMix Stand Mixer",
  "Multipro Sense",
  "Triblade Hand Blender",
  "BM450 Bread Maker",
  "KWK-55",
  "Triblade Hand Blender HDP404WH",
  "AT650A Attachment",
  "KVL8300S Chef XL Titanium",

  "Forerunner 945",
  "Fenix 6 Pro",
  "Vivoactive 4",
  "Forerunner 745",
  "Venu 2",
  "Instinct Solar",
  "Edge 1030 Plus",
  "Vivoactive 3",
  "Fenix 5X Plus",
  "Venu Sq",

  "Hero 10 Black",
  "Hero 9 Black",
  "Max 360",
  "Hero 8 Black",
  "HERO7 Silver",
  "HERO6 Black",
  "HERO5 Black",
  "HERO7 Black",
  "Fusion 360",
  "HERO Session",

  "Versa 3",
  "Sense",
  "Charge 5",
  "Inspire 2",
  "Ace 3",
  "Sense 2",
  "Versa 2",
  "Charge 4",
  "Flex 2",
  "Alta HR",

  "Nest Hub Max",
  "Nest Hello",
  "Nest Learning Thermostat",
  "Nest Cam IQ",
  "Nest Protect",
  "Nest Doorbell",
  "Nest Cam",
  "Nest Thermostat E",
  "Nest x Yale Lock",
  "Nest Hub"
]

async function getBrands() {
  const query = `SELECT id, name FROM equipment_brands`
  const results = await dbQueryExecutor.execute(query, [])
  return results
}

async function createTypes(startDate, endDate) {
  const typesQuery = `
    INSERT INTO equipment_types (name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const type of types) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(typesQuery, [type, createdByUserId, createdAtDatetime])
  }
}

async function createBrands(startDate, endDate) {
  const brandsQuery = `
    INSERT INTO equipment_brands (name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const brand of brands) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(brandsQuery, [brand, createdByUserId, createdAtDatetime])
  }
}

async function createModels(startDate, endDate) {
  const brands = await getBrands()
  const brandIds = brands.map((brand) => brand.id)

  const modelsQuery = `
    INSERT INTO equipment_models (name, brand_id, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const model of models) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    const randomBrandId = brandIds[Math.floor(Math.random() * brandIds.length)]
    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(modelsQuery, [
      model,
      randomBrandId,
      createdByUserId,
      createdAtDatetime
    ])
  }
}

async function createEquipment(startDate, endDate) {
  const types = await dbQueryExecutor.execute("SELECT id, name FROM equipment_types", [])
  const brands = await dbQueryExecutor.execute("SELECT id, name FROM equipment_brands", [])
  const models = await dbQueryExecutor.execute(
    "SELECT id, brand_id, name FROM equipment_models",
    []
  )

  const getValidClientId = async (date) => {
    const clientQuery = `
      SELECT id, name, description
      FROM clients
      WHERE created_at_datetime <= ?
      ORDER BY created_at_datetime DESC;
    `
    const clientResult = await dbQueryExecutor.execute(clientQuery, [date])
    if (clientResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * clientResult.length)
    return clientResult[randomIndex]
  }

  const getValidUserId = async (date) => {
    const userQuery = `
      SELECT id
      FROM users
      WHERE created_at_datetime <= ?
      ORDER BY created_at_datetime DESC;
    `
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  let createdByUserId = null
  let client = null
  let createdAt

  const maxAttempts = 50
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    createdAt = generateRandomCreationDate(startDate, endDate)

    createdByUserId = await getValidUserId(createdAt)
    client = await getValidClientId(createdAt)

    if (createdByUserId && client) {
      break
    }
  }

  if (!createdByUserId || !client) {
    throw new Error("No valid user or client found for the creation date after several attempts.")
  }

  const typeId = types[getRandomInt(0, types.length - 1)].id
  let brandId
  let modelId
  let availableModels = []

  do {
    brandId = brands[getRandomInt(0, brands.length - 1)].id
    availableModels = models.filter((model) => model.brand_id === brandId)
  } while (availableModels.length === 0)

  modelId = availableModels[getRandomInt(0, availableModels.length - 1)].id

  const equipmentQuery = `
    INSERT INTO equipments (client_id, type_id, brand_id, model_id, sn, description, created_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `

  const sn = faker.string.uuid()
  const description = `<p>${faker.lorem.paragraph()}</p>`
  const equipmentValues = [
    client.id,
    typeId,
    brandId,
    modelId,
    sn,
    description,
    createdByUserId,
    createdAt
  ]

  const equipmentResult = await dbQueryExecutor.execute(equipmentQuery, equipmentValues)
  const equipmentId = equipmentResult.insertId

  const changes = [
    {
      field: "Cliente",
      after: {
        id: client.id,
        name: client.name,
        description: client.description
      }
    },
    {
      field: "Tipo",
      after: {
        id: typeId,
        name: types.find((t) => t.id === typeId).name
      }
    },
    {
      field: "Marca",
      after: {
        id: brandId,
        name: brands.find((b) => b.id === brandId).name
      }
    },
    {
      field: "Modelo",
      after: {
        id: modelId,
        name: models.find((m) => m.id === modelId).name
      }
    },
    {
      field: "SN",
      after: sn
    },
    {
      field: "Descrição",
      after: description ? description : null
    }
  ]

  const activityHistoryQuery = `
    INSERT INTO equipment_interactions_history (equipment_id, type, details, responsible_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?);
  `
  const activityHistoryValues = [
    equipmentId,
    "Equipamento Criado",
    JSON.stringify(changes),
    createdByUserId,
    createdAt
  ]

  await dbQueryExecutor.execute(activityHistoryQuery, activityHistoryValues)

  return createdAt
}

async function createEquipments(numEquipments, startDate, endDate) {
  for (let i = 0; i < numEquipments; i++) {
    await createEquipment(startDate, endDate)
  }
}

const repairEntryAccessoriesOptions = [
  "Capa",
  "Transformador",
  "Comando",
  "Carregador",
  "Auriculares",
  "Case",
  "Protector de tela",
  "Bateria extra",
  "Suporte de carregamento",
  "Adaptador",
  "Almofada de carregamento",
  "Cabo de dados",
  "Base de carregamento",
  "Bolsa de proteção",
  "Cabo HDMI",
  "Leitor de cartões",
  "Hub USB",
  "Suporte para tablet",
  "Rato sem fio",
  "Teclado sem fio",
  "Fone de ouvido Bluetooth",
  "Suporte para telemóvel"
]

const repairEntryReportedIssuesOptions = [
  "Bateria danificada",
  "Tela quebrada",
  "Problema no carregador",
  "Problema no botão",
  "Falha no sistema",
  "Problema de conectividade",
  "Superaquecimento",
  "Porta USB danificada",
  "Problema de áudio",
  "Falha de ligação",
  "Problema com Wi-Fi",
  "Erro de software",
  "Problema com a câmera",
  "Problema de desempenho",
  "Problema no display",
  "Problema de sincronização",
  "Problema de firmware",
  "Problema com a ligação Bluetooth",
  "Problema de leitura de cartão",
  "Falha no sistema de refrigeração",
  "Problema com a antena"
]

const repairInterventionWorksDoneOptions = [
  "Substituição da bateria",
  "Troca de tela",
  "Reparo do carregador",
  "Substituição do botão",
  "Atualização do sistema",
  "Reparação da porta USB",
  "Limpeza interna",
  "Correção de conectividade",
  "Reparação do áudio",
  "Troca do módulo de câmera",
  "Reparo do Wi-Fi",
  "Reparo de software",
  "Substituição de componentes internos",
  "Ajuste de desempenho",
  "Reparo de sistema de refrigeração",
  "Troca de módulo Bluetooth",
  "Reparo de leitor de cartões",
  "Correção de firmware",
  "Ajuste de antena",
  "Substituição de peças de proteção",
  "Troca de cabos internos",
  "Reparação de sistema de som"
]

const repairInterventionAccessoriesUsedOptions = [
  "Bateria",
  "Tela",
  "Carregador",
  "Botão",
  "Porta USB",
  "Pasta térmica",
  "Ferramentas de abertura",
  "Cabo de conexão",
  "Módulo de áudio",
  "Módulo de câmera",
  "Cabo de dados",
  "Suporte de carregamento",
  "Base de carregamento",
  "Peças de substituição internas",
  "Cabo HDMI",
  "Leitor de cartões",
  "Hub USB",
  "Peças de refrigeração",
  "Módulo Bluetooth",
  "Peças de proteção",
  "Cabo de antena",
  "Conectores",
  "Resistores e capacitores",
  "Componentes de firmware"
]

const repairStatusOptions = [
  { name: "Entrada", color: "info" },
  { name: "Saída", color: "success" },
  { name: "Stand By", color: "warning" },
  { name: "Fechado", color: "default" },
  { name: "Em Progresso", color: "primary" },
  { name: "Aguardando Peças", color: "error" },
  { name: "Aprovado", color: "success" },
  { name: "Rejeitado", color: "error" },
  { name: "Cancelado", color: "default" },
  { name: "Em Avaliação", color: "info" },
  { name: "Em Teste", color: "primary" },
  { name: "Aguardando Aprovação", color: "warning" }
]

async function createRepairEntryAccessoriesOptions(startDate, endDate) {
  const query = `
    INSERT INTO repair_entry_accessories_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const option of repairEntryAccessoriesOptions) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(query, [option, createdByUserId, createdAtDatetime])
  }
}

async function createRepairEntryReportedIssuesOptions(startDate, endDate) {
  const query = `
    INSERT INTO repair_entry_reported_issues_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const option of repairEntryReportedIssuesOptions) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(query, [option, createdByUserId, createdAtDatetime])
  }
}

async function createRepairInterventionWorksDoneOptions(startDate, endDate) {
  const query = `
    INSERT INTO repair_intervention_works_done_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const option of repairInterventionWorksDoneOptions) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(query, [option, createdByUserId, createdAtDatetime])
  }
}

async function createRepairInterventionAccessoriesUsedOptions(startDate, endDate) {
  const query = `
    INSERT INTO repair_intervention_accessories_used_options (name, created_by_user_id, created_at_datetime) VALUES (?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const option of repairInterventionAccessoriesUsedOptions) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(query, [option, createdByUserId, createdAtDatetime])
  }
}

async function createRepairStatusOptions(startDate, endDate) {
  const query = `
    INSERT INTO repair_status (name, color, created_by_user_id, created_at_datetime) VALUES (?, ?, ?, ?);
  `

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getRandomValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  for (const option of repairStatusOptions) {
    const createdAtDatetime = generateRandomCreationDate(startDate, endDate)

    let createdByUserId = await getRandomValidUserId(createdAtDatetime)

    while (!createdByUserId) {
      createdAtDatetime = generateRandomCreationDate(startDate, endDate)
      createdByUserId = await getRandomValidUserId(createdAtDatetime)
    }

    await dbQueryExecutor.execute(query, [
      option.name,
      option.color,
      createdByUserId,
      createdAtDatetime
    ])
  }
}

async function getRepairStatusOptions() {
  const query = `SELECT id, name, color FROM repair_status`
  return await dbQueryExecutor.execute(query, [])
}

async function getRepairEntryAccessoriesOptions() {
  const query = `SELECT id FROM repair_entry_accessories_options`
  return await dbQueryExecutor.execute(query, [])
}

async function getRepairReportedIssuesOptions() {
  const query = `SELECT id FROM repair_entry_reported_issues_options`
  return await dbQueryExecutor.execute(query, [])
}

async function getRepairInterventionWorksDoneOptions() {
  const query = `SELECT id FROM repair_intervention_works_done_options`
  return await dbQueryExecutor.execute(query, [])
}

async function getRepairInterventionAccessoriesUsedOptions() {
  const query = `SELECT id FROM repair_intervention_accessories_used_options`
  return await dbQueryExecutor.execute(query, [])
}

async function createRepair(startDate, endDate) {
  const maxAttempts = 50
  let createdAt
  let createdByUserId = null
  let equipment = null

  const userQuery = `
    SELECT id
    FROM users
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getValidUserId = async (date) => {
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  const equipmentQuery = `
    SELECT id, client_id, type_id, brand_id, model_id, sn, description
    FROM equipments
    WHERE created_at_datetime <= ?
    ORDER BY created_at_datetime DESC;
  `

  const getValidEquipment = async (date) => {
    const equipmentResult = await dbQueryExecutor.execute(equipmentQuery, [date])
    if (equipmentResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * equipmentResult.length)
    return equipmentResult[randomIndex]
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    createdAt = generateRandomCreationDate(startDate, endDate)

    createdByUserId = await getValidUserId(createdAt)
    equipment = await getValidEquipment(createdAt)

    if (createdByUserId && equipment) {
      break
    }
  }

  if (!createdByUserId || !equipment) {
    throw new Error(
      "No valid user or equipment found for the creation date after several attempts."
    )
  }

  const statusOptions = await getRepairStatusOptions()
  const statusId = statusOptions[getRandomInt(0, statusOptions.length - 1)].id

  const entryDatetime = createdAt
  const conclusionDatetime =
    Math.random() > 0.5
      ? new Date(entryDatetime.getTime() + getRandomInt(1, 10) * 24 * 60 * 60 * 1000)
      : null
  const deliveryDatetime = conclusionDatetime
    ? Math.random() > 0.5
      ? new Date(conclusionDatetime.getTime() + getRandomInt(1, 10) * 24 * 60 * 60 * 1000)
      : null
    : null
  const isClientNotified = deliveryDatetime ? true : false

  const repairQuery = `
    INSERT INTO repairs (
      equipment_id, status_id, entry_accessories_description, entry_reported_issues_description,
      entry_description, entry_datetime, intervention_works_done_description,
      intervention_accessories_used_description, intervention_description, conclusion_datetime,
      delivery_datetime, is_client_notified, created_by_user_id, created_at_datetime
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `

  const repairValues = [
    equipment.id,
    statusId,
    `<p>${faker.lorem.paragraph()}</p>`,
    `<p>${faker.lorem.paragraph()}</p>`,
    `<p>${faker.lorem.paragraph()}</p>`,
    entryDatetime,
    `<p>${faker.lorem.paragraph()}</p>`,
    `<p>${faker.lorem.paragraph()}</p>`,
    `<p>${faker.lorem.paragraph()}</p>`,
    conclusionDatetime,
    deliveryDatetime,
    isClientNotified,
    createdByUserId,
    createdAt
  ]

  const repairResult = await dbQueryExecutor.execute(repairQuery, repairValues)
  const repairId = repairResult.insertId

  const changes = [
    {
      field: "Estado",
      after: {
        id: statusId,
        name: statusOptions.find((option) => option.id === statusId).name,
        color: statusOptions.find((option) => option.id === statusId).color
      }
    },
    {
      field: "Equipamento",
      after: {
        id: equipment.id,
        client: {
          id: equipment.client_id,
          name: (
            await dbQueryExecutor.execute("SELECT name FROM clients WHERE id = ?", [
              equipment.client_id
            ])
          )[0].name,
          description: (
            await dbQueryExecutor.execute("SELECT description FROM clients WHERE id = ?", [
              equipment.client_id
            ])
          )[0].description
        },
        type: {
          id: equipment.type_id,
          name: (
            await dbQueryExecutor.execute("SELECT name FROM equipment_types WHERE id = ?", [
              equipment.type_id
            ])
          )[0].name
        },
        brand: {
          id: equipment.brand_id,
          name: (
            await dbQueryExecutor.execute("SELECT name FROM equipment_brands WHERE id = ?", [
              equipment.brand_id
            ])
          )[0].name
        },
        model: {
          id: equipment.model_id,
          name: (
            await dbQueryExecutor.execute("SELECT name FROM equipment_models WHERE id = ?", [
              equipment.model_id
            ])
          )[0].name
        },
        sn: equipment.sn,
        description: equipment.description
      }
    },
    { field: "Data de entrada", after: entryDatetime },
    { field: "Descrição da entrada", after: repairValues[4] || null }
  ]

  const activityHistoryQuery = `
    INSERT INTO repair_interactions_history (repair_id, type, details, responsible_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?);
  `
  const activityHistoryValues = [
    repairId,
    "Reparação Criada",
    JSON.stringify(changes),
    createdByUserId,
    createdAt
  ]

  await dbQueryExecutor.execute(activityHistoryQuery, activityHistoryValues)

  const entryAccessoriesOptions = await getRepairEntryAccessoriesOptions()
  const reportedIssuesOptions = await getRepairReportedIssuesOptions()
  const worksDoneOptions = await getRepairInterventionWorksDoneOptions()
  const accessoriesUsedOptions = await getRepairInterventionAccessoriesUsedOptions()

  const entryAccessoriesSet = new Set()
  const numEntryAccessories = Math.floor(
    getRandomInt(0, Math.floor(entryAccessoriesOptions.length / 2))
  )
  for (let i = 0; i < numEntryAccessories; i++) {
    let accessoryOptionId
    do {
      accessoryOptionId = getRandomInt(1, entryAccessoriesOptions.length)
    } while (
      entryAccessoriesSet.has(accessoryOptionId) ||
      !entryAccessoriesOptions.some((opt) => opt.id === accessoryOptionId)
    )

    entryAccessoriesSet.add(accessoryOptionId)
    await dbQueryExecutor.execute(
      `
      INSERT INTO repair_entry_accessories (repair_id, accessory_option_id)
      VALUES (?, ?);
    `,
      [repairId, accessoryOptionId]
    )
  }

  const reportedIssuesSet = new Set()
  const numReportedIssues = Math.floor(
    getRandomInt(0, Math.floor(reportedIssuesOptions.length / 2))
  )
  for (let i = 0; i < numReportedIssues; i++) {
    let reportedIssueOptionId
    do {
      reportedIssueOptionId = getRandomInt(1, reportedIssuesOptions.length)
    } while (
      reportedIssuesSet.has(reportedIssueOptionId) ||
      !reportedIssuesOptions.some((opt) => opt.id === reportedIssueOptionId)
    )

    reportedIssuesSet.add(reportedIssueOptionId)
    await dbQueryExecutor.execute(
      `
      INSERT INTO repair_entry_reported_issues (repair_id, reported_issue_option_id)
      VALUES (?, ?);
    `,
      [repairId, reportedIssueOptionId]
    )
  }

  const worksDoneSet = new Set()
  const numWorksDone = Math.floor(getRandomInt(0, Math.floor(worksDoneOptions.length / 2)))
  for (let i = 0; i < numWorksDone; i++) {
    let workDoneOptionId
    do {
      workDoneOptionId = getRandomInt(1, worksDoneOptions.length)
    } while (
      worksDoneSet.has(workDoneOptionId) ||
      !worksDoneOptions.some((opt) => opt.id === workDoneOptionId)
    )

    worksDoneSet.add(workDoneOptionId)
    await dbQueryExecutor.execute(
      `
      INSERT INTO repair_intervention_works_done (repair_id, work_done_option_id)
      VALUES (?, ?);
    `,
      [repairId, workDoneOptionId]
    )
  }

  const accessoriesUsedSet = new Set()
  const numAccessoriesUsed = Math.floor(
    getRandomInt(0, Math.floor(accessoriesUsedOptions.length / 2))
  )
  for (let i = 0; i < numAccessoriesUsed; i++) {
    let accessoriesUsedOptionId
    do {
      accessoriesUsedOptionId = getRandomInt(1, accessoriesUsedOptions.length)
    } while (
      accessoriesUsedSet.has(accessoriesUsedOptionId) ||
      !accessoriesUsedOptions.some((opt) => opt.id === accessoriesUsedOptionId)
    )

    accessoriesUsedSet.add(accessoriesUsedOptionId)
    await dbQueryExecutor.execute(
      `
      INSERT INTO repair_intervention_accessories_used (repair_id, accessories_used_option_id)
      VALUES (?, ?);
    `,
      [repairId, accessoriesUsedOptionId]
    )
  }

  return repairId
}

async function createRepairs(numRepairs, startDate, endDate) {
  for (let i = 0; i < numRepairs; i++) {
    await createRepair(startDate, endDate)
  }
}

async function createEmail(startDate, endDate) {
  const getClientWithEmail = async (date) => {
    const clientQuery = `
      SELECT c.id, cc.contact
      FROM clients c
      JOIN client_contacts cc ON c.id = cc.client_id
      WHERE cc.type = 'E-mail' AND c.created_at_datetime <= ?
      ORDER BY c.created_at_datetime DESC;
    `
    const clientResult = await dbQueryExecutor.execute(clientQuery, [date])
    if (clientResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * clientResult.length)
    return clientResult[randomIndex]
  }

  const getValidUserId = async (date) => {
    const userQuery = `
      SELECT id
      FROM users
      WHERE created_at_datetime <= ?
      ORDER BY created_at_datetime DESC;
    `
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  let createdByUserId = null
  let clientData = null
  let createdAt

  const maxAttempts = 50
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    createdAt = generateRandomCreationDate(startDate, endDate)

    createdByUserId = await getValidUserId(createdAt)
    clientData = await getClientWithEmail(createdAt)

    if (createdByUserId && clientData) {
      break
    }
  }

  if (!createdByUserId || !clientData) {
    throw new Error(
      "No valid user or client with email found for the creation date after several attempts."
    )
  }

  const { id: clientId, contact: email } = clientData
  const apiId = faker.string.uuid()
  const subject = faker.lorem.words()

  const emailQuery = `
    INSERT INTO emails (api_id, client_id, contact, subject, sent_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?, ?);
  `
  const emailValues = [apiId, clientId, email, subject, createdByUserId, createdAt]

  await dbQueryExecutor.execute(emailQuery, emailValues)

  return createdAt
}

async function createEmails(numEmails, startDate, endDate) {
  for (let i = 0; i < numEmails; i++) {
    await createEmail(startDate, endDate)
  }
}

async function createSMS(startDate, endDate) {
  const getClientWithPhone = async (date) => {
    const clientQuery = `
      SELECT c.id, cc.contact
      FROM clients c
      JOIN client_contacts cc ON c.id = cc.client_id
      WHERE cc.type IN ('Telefone', 'Telemóvel') AND c.created_at_datetime <= ?
      ORDER BY c.created_at_datetime DESC;
    `
    const clientResult = await dbQueryExecutor.execute(clientQuery, [date])
    if (clientResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * clientResult.length)
    return clientResult[randomIndex]
  }

  const getValidUserId = async (date) => {
    const userQuery = `
      SELECT id
      FROM users
      WHERE created_at_datetime <= ?
      ORDER BY created_at_datetime DESC;
    `
    const userResult = await dbQueryExecutor.execute(userQuery, [date])
    if (userResult.length === 0) return null

    const randomIndex = Math.floor(Math.random() * userResult.length)
    return userResult[randomIndex].id
  }

  let createdByUserId = null
  let clientData = null
  let createdAt

  const maxAttempts = 50
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    createdAt = generateRandomCreationDate(startDate, endDate)

    createdByUserId = await getValidUserId(createdAt)
    clientData = await getClientWithPhone(createdAt)

    if (createdByUserId && clientData) {
      break
    }
  }

  if (!createdByUserId || !clientData) {
    throw new Error(
      "No valid user or client with phone found for the creation date after several attempts."
    )
  }

  const phoneNumber = clientData.contact
  const apiId = faker.string.uuid()
  const message = faker.lorem.paragraph()

  const smsQuery = `
    INSERT INTO smses (api_id, client_id, contact, message, sent_by_user_id, created_at_datetime)
    VALUES (?, ?, ?, ?, ?, ?);
  `
  const smsValues = [apiId, clientData.id, phoneNumber, message, createdByUserId, createdAt]

  await dbQueryExecutor.execute(smsQuery, smsValues)

  return createdAt
}

async function createSMSs(numSMSs, startDate, endDate) {
  for (let i = 0; i < numSMSs; i++) {
    await createSMS(startDate, endDate)
  }
}

// 1. Criar inicialmente alguns funcionários - [✓]
/* createUsers(faker.number.int({ min: 30, max: 50 }), new Date("2023-01-02"), new Date("2023-01-17"))
  .then(() => console.log("Todos os usuários e empregados foram criados com sucesso."))
  .catch((error) => console.error("Erro durante a criação dos usuários e empregados:", error)) */

// 2. Depois criar alguns clientes (com moradas e contactos) - [✓]
/* createClients(
  faker.number.int({ min: 10, max: 40 }),
  new Date("2023-01-01"),
  new Date("2023-06-30")
)
  .then(() =>
    createClients(
      faker.number.int({ min: 60, max: 80 }),
      new Date("2023-06-01"),
      new Date("2023-09-30")
    )
      .then(() =>
        createClients(
          faker.number.int({ min: 100, max: 170 }),
          new Date("2023-10-01"),
          new Date("2023-12-30")
        )
          .then(() =>
            createClients(
              faker.number.int({ min: 10, max: 20 }),
              new Date("2024-01-01"),
              new Date("2024-01-30")
            )
              .then(() =>
                createClients(
                  faker.number.int({ min: 80, max: 100 }),
                  new Date("2024-02-01"),
                  new Date("2024-04-30")
                )
                  .then(() =>
                    createClients(
                      faker.number.int({ min: 120, max: 160 }),
                      new Date("2024-04-01"),
                      new Date("2024-06-30")
                    )
                      .then(() =>
                        createClients(
                          faker.number.int({ min: 100, max: 130 }),
                          new Date("2024-07-01"),
                          new Date("2024-09-10")
                        )
                          .then(() => console.log("Todos os clientes foram criados com sucesso."))
                          .catch((error) =>
                            console.error("Erro durante a criação dos clientes:", error)
                          )
                      )
                      .catch((error) =>
                        console.error("Erro durante a criação dos clientes:", error)
                      )
                  )
                  .catch((error) => console.error("Erro durante a criação dos clientes:", error))
              )
              .catch((error) => console.error("Erro durante a criação dos clientes:", error))
          )
          .catch((error) => console.error("Erro durante a criação dos clientes:", error))
      )
      .catch((error) => console.error("Erro durante a criação dos clientes:", error))
  )
  .catch((error) => console.error("Erro durante a criação dos clientes:", error)) */

// 3. Depois criar dados relacionados com equipamentos - [✓]
/* createTypes(new Date("2023-01-02"), new Date("2023-01-17"))
  .then(() => {
    console.log("Todos os tipos de equipamentos foram criados com sucesso.")
    return createBrands(new Date("2023-01-02"), new Date("2023-01-17"))
  })
  .then(() => {
    console.log("Todas as marcas foram criadas com sucesso.")
    return createModels(new Date("2023-01-02"), new Date("2023-01-17"))
  })
  .then(() => {
    console.log("Todos os modelos foram criados com sucesso.")
  })
  .catch((error) => {
    console.error("Erro durante a criação dos dados:", error)
  }) */

// 4. Depois equipamentos - [✓]
/* createEquipments(
  faker.number.int({ min: 15, max: 80 }),
  new Date("2023-01-21"),
  new Date("2023-06-30")
)
  .then(() =>
    createEquipments(
      faker.number.int({ min: 70, max: 90 }),
      new Date("2023-06-01"),
      new Date("2023-09-30")
    )
      .then(() =>
        createEquipments(
          faker.number.int({ min: 90, max: 170 }),
          new Date("2023-10-01"),
          new Date("2023-12-30")
        )
          .then(() =>
            createEquipments(
              faker.number.int({ min: 30, max: 60 }),
              new Date("2024-01-01"),
              new Date("2024-01-30")
            )
              .then(() =>
                createEquipments(
                  faker.number.int({ min: 50, max: 80 }),
                  new Date("2024-02-01"),
                  new Date("2024-04-30")
                )
                  .then(() =>
                    createEquipments(
                      faker.number.int({ min: 100, max: 120 }),
                      new Date("2024-04-01"),
                      new Date("2024-06-30")
                    )
                      .then(() =>
                        createEquipments(
                          faker.number.int({ min: 180, max: 190 }),
                          new Date("2024-07-01"),
                          new Date("2024-09-10")
                        )
                          .then(() =>
                            console.log("Todos os equipamentos foram criados com sucesso.")
                          )
                          .catch((error) =>
                            console.error("Erro durante a criação dos equipamentos:", error)
                          )
                      )
                      .catch((error) =>
                        console.error("Erro durante a criação dos equipamentos:", error)
                      )
                  )
                  .catch((error) =>
                    console.error("Erro durante a criação dos equipamentos:", error)
                  )
              )
              .catch((error) => console.error("Erro durante a criação dos equipamentos:", error))
          )
          .catch((error) => console.error("Erro durante a criação dos equipamentos:", error))
      )
      .catch((error) => console.error("Erro durante a criação dos equipamentos:", error))
  )
  .catch((error) => console.error("Erro durante a criação dos equipamentos:", error)) */

// 5. Depois criar dados relacionados com reparações - [✓]
/* createRepairEntryAccessoriesOptions(new Date("2023-01-02"), new Date("2023-01-17"))
  .then(() => {
    return createRepairEntryReportedIssuesOptions(new Date("2023-01-02"), new Date("2023-01-17"))
  })
  .then(() => {
    return createRepairInterventionWorksDoneOptions(new Date("2023-01-02"), new Date("2023-01-17"))
  })
  .then(() => {
    return createRepairInterventionAccessoriesUsedOptions(
      new Date("2023-01-02"),
      new Date("2023-01-17")
    )
  })
  .then(() => {
    return createRepairStatusOptions(new Date("2023-01-02"), new Date("2023-01-17"))
  })
  .then(() => {
    console.log("Dados de reparação inseridos com sucesso.")
  })
  .catch((error) => {
    console.error("Erro durante a criação dos dados:", error)
  }) */

// 6. Depois reparações - [✓]
/* createRepairs(
  faker.number.int({ min: 25, max: 90 }),
  new Date("2023-01-21"),
  new Date("2023-06-30")
)
  .then(() =>
    createRepairs(
      faker.number.int({ min: 110, max: 170 }),
      new Date("2023-06-01"),
      new Date("2023-09-30")
    )
      .then(() =>
        createRepairs(
          faker.number.int({ min: 190, max: 210 }),
          new Date("2023-10-01"),
          new Date("2023-12-30")
        )
          .then(() =>
            createRepairs(
              faker.number.int({ min: 50, max: 70 }),
              new Date("2024-01-01"),
              new Date("2024-01-30")
            )
              .then(() =>
                createRepairs(
                  faker.number.int({ min: 110, max: 140 }),
                  new Date("2024-02-01"),
                  new Date("2024-04-30")
                )
                  .then(() =>
                    createRepairs(
                      faker.number.int({ min: 130, max: 170 }),
                      new Date("2024-04-01"),
                      new Date("2024-06-30")
                    )
                      .then(() =>
                        createRepairs(
                          faker.number.int({ min: 200, max: 280 }),
                          new Date("2024-07-01"),
                          new Date("2024-09-10")
                        )
                          .then(() => console.log("Todas as reparações foram criadas com sucesso."))
                          .catch((error) =>
                            console.error("Erro durante a criação das reparações:", error)
                          )
                      )
                      .catch((error) =>
                        console.error("Erro durante a criação das reparações:", error)
                      )
                  )
                  .catch((error) => console.error("Erro durante a criação das reparações:", error))
              )
              .catch((error) => console.error("Erro durante a criação das reparações:", error))
          )
          .catch((error) => console.error("Erro durante a criação das reparações:", error))
      )
      .catch((error) => console.error("Erro durante a criação das reparações:", error))
  )
  .catch((error) => console.error("Erro durante a criação das reparações:", error)) */

// 7. Depois e-mails - [✓]
/* createEmails(faker.number.int({ min: 20, max: 60 }), new Date("2023-01-01"), new Date("2023-06-30"))
  .then(() =>
    createEmails(
      faker.number.int({ min: 100, max: 130 }),
      new Date("2023-06-01"),
      new Date("2023-09-30")
    )
      .then(() =>
        createEmails(
          faker.number.int({ min: 160, max: 180 }),
          new Date("2023-10-01"),
          new Date("2023-12-30")
        )
          .then(() =>
            createEmails(
              faker.number.int({ min: 30, max: 70 }),
              new Date("2024-01-01"),
              new Date("2024-01-30")
            )
              .then(() =>
                createEmails(
                  faker.number.int({ min: 220, max: 280 }),
                  new Date("2024-02-01"),
                  new Date("2024-04-30")
                )
                  .then(() =>
                    createEmails(
                      faker.number.int({ min: 180, max: 210 }),
                      new Date("2024-04-01"),
                      new Date("2024-06-30")
                    )
                      .then(() =>
                        createEmails(
                          faker.number.int({ min: 120, max: 130 }),
                          new Date("2024-07-01"),
                          new Date("2024-09-10")
                        )
                          .then(() => console.log("Todos os emails foram criados com sucesso."))
                          .catch((error) =>
                            console.error("Erro durante a criação dos emails:", error)
                          )
                      )
                      .catch((error) => console.error("Erro durante a criação dos emails:", error))
                  )
                  .catch((error) => console.error("Erro durante a criação dos emails:", error))
              )
              .catch((error) => console.error("Erro durante a criação dos emails:", error))
          )
          .catch((error) => console.error("Erro durante a criação dos emails:", error))
      )
      .catch((error) => console.error("Erro durante a criação dos emails:", error))
  )
  .catch((error) => console.error("Erro durante a criação dos emails:", error)) */

// 8. Depois sms - [✓]
/* createSMSs(faker.number.int({ min: 40, max: 80 }), new Date("2023-01-01"), new Date("2023-06-30"))
  .then(() =>
    createSMSs(
      faker.number.int({ min: 210, max: 290 }),
      new Date("2023-06-01"),
      new Date("2023-09-30")
    )
      .then(() =>
        createSMSs(
          faker.number.int({ min: 380, max: 410 }),
          new Date("2023-10-01"),
          new Date("2023-12-30")
        )
          .then(() =>
            createSMSs(
              faker.number.int({ min: 70, max: 90 }),
              new Date("2024-01-01"),
              new Date("2024-01-30")
            )
              .then(() =>
                createSMSs(
                  faker.number.int({ min: 220, max: 310 }),
                  new Date("2024-02-01"),
                  new Date("2024-04-30")
                )
                  .then(() =>
                    createSMSs(
                      faker.number.int({ min: 190, max: 210 }),
                      new Date("2024-04-01"),
                      new Date("2024-06-30")
                    )
                      .then(() =>
                        createSMSs(
                          faker.number.int({ min: 270, max: 310 }),
                          new Date("2024-07-01"),
                          new Date("2024-09-10")
                        )
                          .then(() => console.log("Todos os SMS foram criados com sucesso."))
                          .catch((error) => console.error("Erro durante a criação dos SMS:", error))
                      )
                      .catch((error) => console.error("Erro durante a criação dos SMS:", error))
                  )
                  .catch((error) => console.error("Erro durante a criação dos SMS:", error))
              )
              .catch((error) => console.error("Erro durante a criação dos SMS:", error))
          )
          .catch((error) => console.error("Erro durante a criação dos SMS:", error))
      )
      .catch((error) => console.error("Erro durante a criação dos SMS:", error))
  )
  .catch((error) => console.error("Erro durante a criação dos SMS:", error)) */
