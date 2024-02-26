import React, { useState, useEffect } from "react"

import { Navbar, Sidebar, Content } from "@components"

const Body = ({ toggleSidebarSize, sidebarSize }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const content = document.querySelector(".main-content")
    const sidebar = document.querySelector(".sidebar")
    const allTitle = document.querySelectorAll(".menu-item-title")
    const allBut = document.querySelectorAll(".but-sidebar")
    const allLinksName = document.querySelectorAll(".links-name-sidebar")
    const allArrows = document.querySelectorAll(".arrow-but")

    const butSidebar = () => {
      allBut.forEach((but) => {
        but.classList.toggle("__small__but", sidebarSize === "small")
      })

      allLinksName.forEach((links) => {
        links.classList.toggle("__small__but__link", sidebarSize === "small")
      })

      allArrows.forEach((arrow) => {
        arrow.classList.toggle("__small__but__link", sidebarSize === "small")
      })

      allTitle.forEach((title) => {
        title.classList.toggle("__small__header", sidebarSize === "small")
      })
    }

    const handleResize = () => {
      const screenWidth = window.innerWidth

      if (screenWidth < 600) {
        content.classList.add("__content__mobile")
        sidebar.classList.add("__sidebar__mobile")
      } else {
        butSidebar()

        setDrawerOpen(false)

        content.classList.remove("__content__mobile")
        sidebar.classList.remove("__sidebar__mobile")
        sidebar.classList.remove("__big__")

        if (sidebarSize === "small") {
          content.classList.add("__big")

          sidebar.classList.add("__small")

          allBut.forEach((but) => {
            but.classList.add("__small__but")
          })

          allLinksName.forEach((links) => {
            links.classList.add("__small__but__link")
          })

          allArrows.forEach((arrow) => {
            arrow.classList.add("__small__but__link")
          })

          allTitle.forEach((title) => {
            title.classList.add("__small__header")
          })
        }
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    if (!sidebar.classList.contains("__sidebar__mobile")) {
      if (sidebarSize === "small") {
        content.classList.add("__big")
        sidebar.classList.add("__small")
        sidebar.classList.add("__focused")
      } else {
        content.classList.remove("__big")
        sidebar.classList.remove("__small")
        sidebar.classList.remove("__focused")
      }

      butSidebar()
    } else {
      if (sidebarSize === "small") {
        sidebar.classList.add("__focused")
      }
    }

    if (sidebar.classList.contains("__focused")) {
      const handleMouseEnter = () => {
        if (sidebarSize === "small") {
          sidebar.classList.remove("__small")

          allBut.forEach((but) => {
            but.classList.remove("__small__but")
          })

          allLinksName.forEach((links) => {
            links.classList.remove("__small__but__link")
          })

          allArrows.forEach((arrow) => {
            arrow.classList.remove("__small__but__link")
          })

          allTitle.forEach((title) => {
            title.classList.remove("__small__header")
          })
        }
      }

      const handleMouseLeave = () => {
        if (sidebarSize === "small") {
          sidebar.classList.add("__small")

          allBut.forEach((but) => {
            but.classList.add("__small__but")
          })

          allLinksName.forEach((links) => {
            links.classList.add("__small__but__link")
          })

          allArrows.forEach((arrow) => {
            arrow.classList.add("__small__but__link")
          })

          allTitle.forEach((title) => {
            title.classList.add("__small__header")
          })
        }
      }

      sidebar.addEventListener("mouseenter", handleMouseEnter)
      sidebar.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        sidebar.removeEventListener("mouseenter", handleMouseEnter)
        sidebar.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [sidebarSize])

  return (
    <>
      <Navbar toggleSidebarSize={toggleSidebarSize} setDrawerOpen={setDrawerOpen} />
      <Sidebar
        sidebarSize={sidebarSize}
        toggleSidebarSize={toggleSidebarSize}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <Content />
    </>
  )
}

export default Body
