"use client";

import Image from "next/image";

const Welcome = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        maxWidth: "800px",
        margin: "0px auto",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "450px" }}>
        <h1>Welcome to Photo Palettes!</h1>
        <p>
          A social platform for generating color palettes from photos inspired
          by{" "}
          <a target="_blank" href="https://seis.pointlessprojects.com">
            Seis Colores / Six Colors
          </a>
          . Check out some of the examples below.
        </p>
        <h2>Inspired?</h2>
        <p>
          <a target="_blank" href="https://forms.gle/DZv1LyEwmEMmZPcC8">
            Join the Closed Alpha
          </a>
          !
        </p>
        <p>
          <a
            target="_blank"
            href="https://bsky.app/profile/sillysideprojects.bsky.social"
          >
            Build with Me
          </a>
          !
        </p>
        <p>
          - Travis Bumgarner (
          <a
            target="_blank"
            href="https://www.linkedin.com/in/travisbumgarner/"
          >
            LinkedIn
          </a>
          ,&nbsp;
          <a target="_blank" href="https://travisbumgarner.dev">
            Portfolio
          </a>
          )
        </p>
      </div>
      <div style={{ width: "100%", aspectRatio: 16 / 9, position: "relative" }}>
        <Image fill alt="color palette 1" src="/landing_page/1.png" />
      </div>
      <div style={{ width: "100%", aspectRatio: 16 / 9, position: "relative" }}>
        <Image fill alt="color palette 1" src="/landing_page/2.png" />
      </div>
      <div style={{ width: "100%", aspectRatio: 16 / 9, position: "relative" }}>
        <Image fill alt="color palette 1" src="/landing_page/3.png" />
      </div>
    </div>
  );
};

export default Welcome;
