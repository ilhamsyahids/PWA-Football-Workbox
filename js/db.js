let dbPromised = idb.open('football', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
  }
});


let insertTeam = (team) => {
  dbPromised.then(db => {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams')
    store.put(team)
    return tx.complete;
  }).then(() => {
    M.toast({ html: `${team.name} Saved` })
  }).catch(err => {
    M.toast({ html: 'Failed to Save' })
  });
}


let deleteTeam = (teamId) => {
  dbPromised.then(db => {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Team has been deleted!' });
    getFavTeams();
  }).catch(err => {
    M.toast({ html: 'Failed to delete' })
  });
}

let selectFavTeams = () => {
  return dbPromised.then(db => {
    let tx = db.transaction('teams', 'readonly');
    let store = tx.objectStore('teams');
    return store.getAll();
  })
}
