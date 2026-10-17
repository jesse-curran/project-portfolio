# Jesse Curran — Robotics Portfolio

M.S. Computer Science (Robotics), UC San Diego, expected Mar. 2027. I work on field autonomy: perception, traversability mapping, and state estimation on real robots.

[Resume (PDF)](assets/resume_jessecurran.pdf) · [jecurran@ucsd.edu](mailto:jecurran@ucsd.edu) · [LinkedIn](https://linkedin.com/in/jessecurran) · [GitHub](https://github.com/jesse-curran)

---

## Demos

### Traversability mapping on an autonomous vehicle (UCSD AVL)

<table>
<tr>
<td width="50%"><a href="https://drive.google.com/file/d/1GEUTlW8xf6S9FQKn1Hj8cLjt9QhWOisc/view"><img src="assets/demos/trav_drive.gif" alt="Real-time traversability score while driving"></a></td>
<td width="50%"><a href="https://drive.google.com/file/d/1J1jpboLTH48mWtOJMagFSADcMSq-2Yyy/view"><img src="assets/demos/trav_costmap.gif" alt="Traversability layers feeding the Nav2 costmap"></a></td>
</tr>
<tr>
<td>Real-time terrain cost from LiDAR geometry and camera semantics while driving campus paths. <a href="https://drive.google.com/file/d/1GEUTlW8xf6S9FQKn1Hj8cLjt9QhWOisc/view">▶ full video</a></td>
<td>The same cost drives the Nav2 costmap (green free, red lethal). <a href="https://drive.google.com/file/d/1J1jpboLTH48mWtOJMagFSADcMSq-2Yyy/view">▶ full video</a> · <a href="https://drive.google.com/drive/folders/1aIm6Ej1MbcgjwUutnlQ2ZSbl6wjdA8O6">all clips</a></td>
</tr>
</table>

### CPU-only person following on the edge (Spot, RGB-D)

<a href="https://docs.google.com/videos/d/1tnw38e2yC2o_S_IRQn3Sl8Zu3tP0-nNNbav365rLAkU/edit?usp=sharing"><img src="assets/demos/follower_compare.gif" alt="Handoff, control, and production identity policies on the same recording"></a>

The three panels show the same recording replayed through three identity policies. A green box means the follower is locked on the enrolled person. Handoff is the follower as I received it. Control is the same identity logic on my faster CPU detector. Production is my adaptive identity layer. [▶ full video](https://docs.google.com/videos/d/1tnw38e2yC2o_S_IRQn3Sl8Zu3tP0-nNNbav365rLAkU/edit?usp=sharing)

F-score is the harmonic mean of recall and precision. All scores come from the demo recording:

| Section | Handoff F | Control F | **Production F** | Production precision | Production stolen frames |
|---|---|---|---|---|---|
| Outdoor | 0.343 | 0.454 | **0.644** | 0.976 | 13 |
| Sun–shade transition | 0.098 | 0.186 | **0.500** | 1.000 | 0 |
| Indoor | 0.207 | 0.227 | **0.577** | 1.000 | 0 |

Production raises F-score in every lighting regime and keeps precision near 1. A stolen frame is a frame where the follower locks onto the wrong person. The largest gain is in the sun–shade transition, which is the original system's known failure case.

### LiDAR obstacle detection

<img src="assets/demos/lidar_clustering.gif" width="640" alt="Ground segmentation and DBSCAN clustering at a roundabout">

I built a C++ pipeline that runs ground segmentation, DBSCAN clustering, and 3D bounding boxes on LiDAR scans at a campus roundabout.

---

## Research and engineering

**Graduate Researcher, Autonomous Vehicles Lab, UC San Diego** (Advisor: Henrik I. Christensen) · Jan. 2026–present
- I am developing on-road and off-road air–ground autonomy. The work covers LiDAR–semantic traversability mapping, Starlink teleoperation, and risk-aware navigation (paper in preparation).
- I built the traversability baseline in ROS 2 from published components:
  - Patchwork++ separates ground from non-ground points.
  - ETH `elevation_mapping_cupy` builds the elevation map.
  - `grid_map` and `traversability_estimation` compute slope, roughness, and step height.
  - YOLO ADE20K semantics are projected into the map.
  - My cost policy fuses all layers into a Nav2 costmap.
- I built and field-tested a ROS 2 Nav2 stack for a GEM e6 vehicle and drove it autonomously for 0.5 mi.
- I integrated FAST-LIO2 LiDAR–inertial localization and measured its error over a 1-mile route.
- I built camera–LiDAR perception: YOLO on TensorRT, the C++ LiDAR 3D detector above, and LiDAR–RealSense depth fusion.
- I ran PX4 UAV waypoint flights alongside the vehicle in joint air–ground field tests. I also wrote a C++ OpenCV ROS 2 detection node for one UAV.

**Edge person follower for a quadruped** (with Julian Raheema, paper in preparation) · 2026
- A follower's most dangerous error is locking onto the wrong person. I redesigned the identity layer of an RGB-D Spot follower so it runs CPU-only.
- The layer combines Kalman tracking, a re-identification memory that adapts online, and a ridge classifier. It runs at 10.5 FPS with no GPU.

**Robotics Autonomy Engineer Intern, NIWC Pacific** · Oct. 2026–present
- I research and develop drone-swarm and UAV autonomy for the RESTORE Lab.

---

## Coursework projects

| | Project | Methods |
|---|---|---|
| | **Autonomous mobile rover** (CSE 276A) | I built a ROS 2 sense–plan–act stack. An EKF fuses AprilTag detections with wheel odometry, and a PID controller tracks the planned trajectory. |
| <img src="assets/figures/vi_ekf_slam.png" width="180"> | **Visual–inertial SLAM** (ECE 276A) | I wrote an EKF on SE(3), the group of 3D rigid-body poses. IMU kinematics predict the pose, and stereo landmark observations correct it. |
| | **Voice-controlled Pokémon battle with robots** (CSE 276B, Human–Robot Interaction) | Players speak commands to their own robot, a Mini Pupper quadruped cast as Pikachu or a TurtleBot. Whisper transcribes the speech and MQTT carries the command to a ROS 2 game controller, which tells the robot what to do. I built the Pupper's ROS 2 behavior node (attack, protect, hurt, faint and celebrate moves, each with matching face images) and co-wrote the game controller. The study asks whether expressive robot reactions change how players perceive the robot's agency. |
| <img src="assets/demos/ur3e_lego.gif" width="180"> | **LEGO pick-and-place with a UR3e arm** (University of Southern Denmark summer school, with the LEGO Group in Billund) · [▶ video](https://drive.google.com/file/d/16VE3l8VNajLJWVrzGNcjO5g4zo6eHGdd/view) | I programmed a Universal Robots UR3e arm to pick LEGO parts and assemble them on a baseplate. |
| <img src="assets/figures/icp_pose_graph.png" width="180"> | **LiDAR SLAM with loop closure** (ECE 276A) · [maps](assets/figures/occupancy_texture_map.png) | I implemented ICP scan matching and GTSAM pose-graph optimization with loop closure, then built an occupancy grid and an RGB-D texture map. The plot shows ICP odometry (red) before loop closure and the pose graph (blue) after. |
| <img src="assets/figures/orientation_panorama.png" width="180"> | **Orientation estimation and panorama** (ECE 276A) | I estimated IMU orientation with quaternion optimization, then used it to stitch camera frames into a panorama. |

**Relevant courses:** Robot Sensing & Estimation, Introduction to Robotics, Artificial Intelligence, Human–Robot Interaction, Math for Robotics, Embedded Systems. I also attended the University of Southern Denmark summer school in robotics (2026).

---

## Skills

- **Languages and tools:** Python, C++, C; Linux, Git, Docker
- **Robotics software:** ROS 2, Nav2, PX4, GTSAM, FAST-LIO2, RViz, Foxglove
- **Perception and ML:** PyTorch, OpenCV, TensorRT, OpenVINO, YOLO
- **Hardware:** LiDAR, Intel RealSense RGB-D, IMUs; Boston Dynamics Spot, PX4 UAVs, GEM e6, UR3e
