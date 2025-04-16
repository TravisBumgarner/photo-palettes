"use client";

import Image from "next/image";
import useGlobalStore from "../store";

const linkStyle = {
  color: "#bd4e85",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
};

const Inspired = () => {
  return (
    <div>
      <h2>Inspired?</h2>
      <ul>
        <li>
          <a
            style={linkStyle}
            target="_blank"
            href="https://forms.gle/DZv1LyEwmEMmZPcC8"
          >
            Join the Closed Alpha
          </a>
        </li>
        <li>
          <a
            style={linkStyle}
            target="_blank"
            href="https://discord.com/invite/J8jwMxEEff"
          >
            Join the Chat on Discord
          </a>
        </li>
        <li>
          <a
            style={linkStyle}
            target="_blank"
            href="https://bsky.app/profile/sillysideprojects.bsky.social"
          >
            Connect on Bluesky
          </a>
        </li>
      </ul>
    </div>
  );
};

const Welcome = () => {
  const user = useGlobalStore((state) => state.user);

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
        fontSize: "30px",
        color: "#222",
      }}
    >
      <div>
        <h1>Welcome {user?.email ? user?.email : "to Photo Palettes!"}</h1>
        <p>A social platform for generating color palettes from photos.</p>
        <p>
          Inspired by{" "}
          <a
            style={linkStyle}
            target="_blank"
            href="https://seis.pointlessprojects.com"
          >
            Seis Colores / Six Colors
          </a>
          . Check out some of the examples below.
        </p>
        <Inspired />
        <p>
          - Travis Bumgarner (
          <a
            style={linkStyle}
            target="_blank"
            href="https://www.linkedin.com/in/travisbumgarner/"
          >
            LinkedIn
          </a>
          ,&nbsp;
          <a
            style={linkStyle}
            target="_blank"
            href="https://travisbumgarner.dev"
          >
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
      <Inspired />
    </div>
  );
};

export default Welcome;
