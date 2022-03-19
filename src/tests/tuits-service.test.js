import {
  createTuit, deleteTuit, findTuitById, findAllTuits, deleteTuitByTuitDescription
} from "../services/tuits-service";

import {
  createUser,
  deleteUsersByUsername
} from "../services/users-service";

describe('can retrieve a tuit by their primary key with REST API', () => {
  // sample user to insert
  const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  //sample tuit to insert
  const userTuit = {
    tuit: 'check',
  };

  beforeAll(async () => {
    deleteUsersByUsername(ripley.username);
    return deleteTuitByTuitDescription(userTuit.tuit);
  })

  afterAll(() => {
    deleteUsersByUsername(ripley.username);
    return deleteTuitByTuitDescription(userTuit.tuit);
  })

  test('can retrieve a tuit by their primary key with REST API', async () => {
    const newUser = await createUser(ripley);
    const newTuit = await createTuit(newUser._id, userTuit);

    expect(newTuit.tuit).toEqual(userTuit.tuit);
    expect(newTuit.postedBy).toEqual(newUser._id);

    const existingTuit = await findTuitById(newTuit._id);

    expect(existingTuit.tuit).toEqual(userTuit.tuit);
    expect(existingTuit.postedBy._id).toEqual(newUser._id)
  })
});

describe('createTuit', async () => {
  // sample user to insert
  const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  //sample tuit to insert
  const ripleyTuit = {
    tuit: "hello"
  };

  // clean up before test runs
  beforeAll(() => {
    deleteUsersByUsername(ripley.username);
    return deleteTuitByTuitDescription(ripleyTuit.tuit);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteUsersByUsername(ripley.username);
    return deleteTuitByTuitDescription(ripleyTuit.tuit);
  })


  test('can create tuit with REST API', async () => {
    // insert new tuit in the database
    const newUser = await createUser(ripley);
    const newTuit = await createTuit(newUser._id, ripleyTuit);

    // verify inserted tuit's properties match parameter user
    expect(newTuit.tuit).toEqual(ripleyTuit.tuit);
    expect(newTuit.postedBy).toEqual(newUser._id);
  });
});

describe('can retrieve all tuits with REST API', () => {

  const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  const tuits = [
    {
      tuit: "humptydumptysatonawall"
    },
    {
      tuit: "hadagreatfall"
    },
    {
      tuit: "letswaitandwaitch"
    },
  ]

  beforeAll(async () => {
    tuits.forEach(t => {
      deleteTuitByTuitDescription(t);
    })
    return deleteUsersByUsername(ripley.username);
  })

  afterAll(() => {
    // remove any data we created
    tuits.forEach(t => {
      deleteTuitByTuitDescription(t);
    })
    deleteUsersByUsername(ripley.username);
  })

  test('can retrieve all tuits with REST API', async () => {
    const newUser = await createUser(ripley);
    tuits.map(tuit =>
      createTuit(
        newUser._id,
        tuit
      )
    )

    const newTuits = await findAllTuits();
    // there should be a minimum number of tuits
    expect(newTuits.length).toBeGreaterThanOrEqual(tuits.length);

    // let's check each tuit we inserted
    const tuitsWeInserted = tuits.filter(
      tuit => tuits.indexOf(tuit.tuit) >= 0);

    tuitsWeInserted.forEach(t => {
      const tuit = tuits.find(tuit => tuit === t.tuit);
      expect(t.tuit).toEqual(tuit);
      expect(t.postedBy._id).toEqual(newUser._id);
    });
  })
});


describe('can delete tuit wtih REST API', async () => {
  // sample user to insert
  const ripley = {
    username: 'ellenripley',
    password: 'lv426',
    email: 'ellenripley@aliens.com'
  };

  //sample tuit to insert
  const ripleyTuit = {
    tuit: 'lost'
  };

  beforeAll(() => {
    deleteUsersByUsername(ripley.username);
    return deleteTuitByTuitDescription(ripleyTuit.tuit);
  })

  // clean up after test runs
  afterAll(() => {
    // remove any data we created
    deleteUsersByUsername(ripley.username);
    return deleteTuitByTuitDescription(ripleyTuit.tuit);
  })


  test('can delete tuit wtih REST API', async () => {
    // insert new tuit in the database
    const newUser = await createUser(ripley);
    const newTuit = await createTuit(newUser._id, ripleyTuit);

    // delete a user by their username. Assumes user already exists
    const status = await deleteTuit(newTuit._id);

    // verify we deleted at least one tuit by its id
    expect(status.deletedCount).toBeGreaterThanOrEqual(1);
  });
});
