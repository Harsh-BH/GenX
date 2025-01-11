
import React, { useRef,useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

const Ship=(props) =>{
  const { animation, ...rest } = props;
  const group = useRef();
  const { nodes, materials, animations } = useGLTF('/nft_card_short_animation_tech_eas.glb');
  // const { actions, names } = useAnimations(animations, group);

  // console.log(names);

  // useEffect(() => {
  //   // Ensure that the animation and the corresponding action exists
  //   if (animation && actions[animation]) {
  //     actions[animation].reset().fadeIn(0.5).play();

  //     // Return the cleanup function with a safety check
  //     return () => {
  //       if (actions[animation]) {
  //         actions[animation].fadeOut(0.5);
  //       }
  //     };
  //   }
  // }, [animation, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="34b12ab28b144e59974d933a5ee337ddfbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="tech"
                  position={[-12.185, 278.305, -28.409]}
                  rotation={[0.438, 1.532, -2.198]}
                  scale={[20.006, 21.226, 3.603]}>
                  <mesh
                    name="0"
                    castShadow
                    receiveShadow
                    geometry={nodes['0'].geometry}
                    material={materials['Material.010']}
                    morphTargetDictionary={nodes['0'].morphTargetDictionary}
                    morphTargetInfluences={nodes['0'].morphTargetInfluences}
                  />
                </group>
                <group
                  name="Camera"
                  position={[1054.651, 303.801, 0]}
                  rotation={[-Math.PI, 0, -Math.PI]}
                  scale={100}>
                  <group name="Object_7" />
                </group>
                <group
                  name="62_c"
                  position={[4.848, 308.119, -0.211]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={420.999}>
                  <mesh
                    name="62_c_62_c_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['62_c_62_c_0'].geometry}
                    material={materials['62_c']}
                  />
                </group>
                <group
                  name="Point003"
                  position={[79.251, 774.76, 552.273]}
                  rotation={[0.866, -0.788, -0.048]}
                  scale={100}>
                  <group name="Object_11" rotation={[Math.PI / 2, 0, 0]}>
                    <group name="Object_12" />
                  </group>
                </group>
                <group
                  name="Curve006"
                  position={[-2.333, 166.88, -3.76]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={265.623}>
                  <mesh
                    name="Curve006_Curve003_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Curve006_Curve003_Baked_0.geometry}
                    material={materials['Curve.003_Baked']}
                  />
                </group>
                <group
                  name="Curve011"
                  position={[-13.773, 287.143, 10.568]}
                  rotation={[0.006, 0.389, -0.932]}
                  scale={[0.437, 0.182, 0.419]}>
                  <mesh
                    name="Curve011_Curve003_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Curve011_Curve003_Baked_0.geometry}
                    material={materials['Curve.003_Baked']}
                  />
                </group>
                <group
                  name="Tech_ship_NFT_EA002_Baked"
                  position={[-18.674, 316.595, 0]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[353.867, 353.867, 77.633]}>
                  <mesh
                    name="Tech_ship_NFT_EA002_Baked_Material004_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Tech_ship_NFT_EA002_Baked_Material004_0.geometry}
                    material={materials['Material.004']}
                  />
                </group>
                <group
                  name="Curve021_Baked"
                  position={[0.459, 313.83, -45.96]}
                  rotation={[0, 1.571, 0]}
                  scale={1807.015}>
                  <mesh
                    name="Curve021_Baked_Curve021_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Curve021_Baked_Curve021_Baked_0.geometry}
                    material={materials['Curve.021_Baked']}
                  />
                </group>
                <group
                  name="Curve003_Baked"
                  position={[0.99, 164.39, -81.709]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={107.571}>
                  <mesh
                    name="Curve003_Baked_Curve003_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Curve003_Baked_Curve003_Baked_0.geometry}
                    material={materials['Curve.003_Baked']}
                  />
                </group>
                <group
                  name="Cube002_Baked"
                  position={[-1.414, 225.288, -100.531]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={[1.575, 1.946, 17.814]}>
                  <mesh
                    name="Cube002_Baked_Tech_ship_NFT_EA004_Baked_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube002_Baked_Tech_ship_NFT_EA004_Baked_Baked_0.geometry}
                    material={materials['Tech_ship_NFT_EA.004_Baked_Baked']}
                  />
                </group>
                <group
                  name="Cube001_Baked"
                  position={[-0.555, 223.732, 0.256]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={[1.598, 85.128, 45.868]}>
                  <mesh
                    name="Cube001_Baked_Cube001_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube001_Baked_Cube001_Baked_0.geometry}
                    material={materials['Cube.001_Baked']}
                  />
                  <group
                    name="Path_5587"
                    position={[-1.671, -0.92, -0.808]}
                    rotation={[Math.PI / 2, 1.571, 0]}
                    scale={[21.512, 39.924, 1146.178]}>
                    <mesh
                      name="Path_5587_Curve003_Baked_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_5587_Curve003_Baked_0.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                  </group>
                  <group
                    name="Path_23362"
                    position={[-2.343, -1.115, -0.773]}
                    rotation={[Math.PI / 2, 1.571, 0]}
                    scale={[21.515, 39.93, 1146.344]}>
                    <mesh
                      name="Path_23362_Curve003_Baked_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362_Curve003_Baked_0.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                    <mesh
                      name="Path_23362_Curve003_Baked_0_1"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362_Curve003_Baked_0_1.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                    <mesh
                      name="Path_23362_Curve003_Baked_0_2"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362_Curve003_Baked_0_2.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                    <mesh
                      name="Path_23362_Curve003_Baked_0_3"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362_Curve003_Baked_0_3.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                    <mesh
                      name="Path_23362_Curve003_Baked_0_4"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362_Curve003_Baked_0_4.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                    <mesh
                      name="Path_23362_Curve003_Baked_0_5"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362_Curve003_Baked_0_5.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                  </group>
                </group>
                <group
                  name="Tech_ship_NFT_EA003_Baked_Baked"
                  position={[-14.317, 316.595, 0]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={353.867}>
                  <mesh
                    name="Tech_ship_NFT_EA003_Baked_Baked_Tech_ship_NFT_EA003_Baked_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.Tech_ship_NFT_EA003_Baked_Baked_Tech_ship_NFT_EA003_Baked_Baked_0
                        .geometry
                    }
                    material={materials['Tech_ship_NFT_EA.003_Baked_Baked']}
                  />
                  <group name="Path_23362001" position={[-0.269, -0.363, 0.024]} scale={5.176}>
                    <mesh
                      name="Path_23362001_Curve003_Baked_0"
                      castShadow
                      receiveShadow
                      geometry={nodes.Path_23362001_Curve003_Baked_0.geometry}
                      material={materials['Curve.003_Baked']}
                    />
                  </group>
                </group>
                <group
                  name="Tech_ship_NFT_EA004_Baked_Baked"
                  position={[-16.848, 316.595, 0]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[350.305, 350.305, 76.851]}>
                  <mesh
                    name="Tech_ship_NFT_EA004_Baked_Baked_Tech_ship_NFT_EA004_Baked_Baked_0"
                    castShadow
                    receiveShadow
                    geometry={
                      nodes.Tech_ship_NFT_EA004_Baked_Baked_Tech_ship_NFT_EA004_Baked_Baked_0
                        .geometry
                    }
                    material={materials['Tech_ship_NFT_EA.004_Baked_Baked']}
                  />
                </group>
                <group name="Point001" position={[176.976, 30.138, -227.118]} scale={100}>
                  <group name="Object_43" rotation={[Math.PI / 2, 0, 0]}>
                    <group name="Object_44" />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/nft_card_short_animation_tech_eas.glb')

export default Ship;