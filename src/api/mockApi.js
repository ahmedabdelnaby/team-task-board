const LATENCY_MS = 700;
const FAILURE_RATE = 0.2;

const members = [
  { id: "m1", name: "Nour Hassan" },
  { id: "m2", name: "Omar Khaled" },
  { id: "m3", name: "Laila Samir" },
  { id: "m4", name: "Tarek Mostafa" },
];

const projects = [
  { id: "p1", name: "Web App" },
  { id: "p2", name: "Billing Portal" },
  { id: "p3", name: "Internal Tools" },
];

function simulate(fn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error("Network error: please try again."));
        return;
      }
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, LATENCY_MS);
  });
}

export function fetchMembers() {
  return simulate(() => members.map((member) => ({ ...member })));
}

export function fetchProjects() {
  return simulate(() => projects.map((project) => ({ ...project })));
}
